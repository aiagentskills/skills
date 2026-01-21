#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { spawnSync } = require('child_process');

const args = process.argv.slice(2);
const options = {
  force: false,
  all: false,
  verbose: false,
  dryRun: false,
  timeoutSeconds: 900,
  skills: []
};

const toList = (value) => value.split(',').map((item) => item.trim()).filter(Boolean);

for (const arg of args) {
  if (arg === '--force') {
    options.force = true;
  } else if (arg === '--all') {
    options.all = true;
  } else if (arg === '--verbose') {
    options.verbose = true;
  } else if (arg === '--dry-run') {
    options.dryRun = true;
  } else if (arg.startsWith('--skills=')) {
    options.skills.push(...toList(arg.slice('--skills='.length)));
  } else if (arg.startsWith('--timeout=')) {
    const value = Number(arg.slice('--timeout='.length));
    if (!Number.isNaN(value) && value > 0) {
      options.timeoutSeconds = value;
    }
  } else if (arg === '--help' || arg === '-h') {
    console.log(`Usage: node scripts/sync-skills-from-readmes.js [options]

Options:
  --all            Process all skill folders (default: README-only)
  --force          Replace existing content folders
  --skills=a,b     Process only these skill ids
  --timeout=900    Curl timeout in seconds per repo
  --dry-run        Print actions without writing
  --verbose        Extra logging
`);
    process.exit(0);
  }
}

const SKILLS_DIR = path.resolve(__dirname, '..', 'skills');
const TEMP_ROOT = path.resolve('/tmp/skills-tarballs');
const EXTRACT_ROOT = path.resolve('/tmp/skills-extracts');
const GITHUB_TOKEN = process.env.GITHUB_TOKEN || '';
const LOCAL_REPO_ROOT = path.resolve(__dirname, '..');

const ensureDir = (dirPath) => fs.mkdirSync(dirPath, { recursive: true });

const run = (cmd, cmdArgs) => {
  const result = spawnSync(cmd, cmdArgs, { stdio: 'inherit' });
  return result.status === 0;
};

const getLocalRepoSlug = () => {
  const result = spawnSync('git', ['remote', 'get-url', 'origin'], {
    cwd: LOCAL_REPO_ROOT,
    encoding: 'utf8'
  });
  if (result.status !== 0) return null;
  const raw = (result.stdout || '').trim();
  if (!raw) return null;

  if (raw.startsWith('git@github.com:')) {
    return raw.replace('git@github.com:', '').replace(/\.git$/, '');
  }

  if (raw.startsWith('https://github.com/')) {
    return raw.replace('https://github.com/', '').replace(/\.git$/, '');
  }

  if (raw.startsWith('ssh://git@github.com/')) {
    return raw.replace('ssh://git@github.com/', '').replace(/\.git$/, '');
  }

  return null;
};

const LOCAL_REPO_SLUG = getLocalRepoSlug();

const getSkillDirs = () => {
  if (!fs.existsSync(SKILLS_DIR)) return [];
  return fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter((dirent) => dirent.isDirectory())
    .map((dirent) => dirent.name);
};

const isReadmeOnly = (skillName) => {
  const skillPath = path.join(SKILLS_DIR, skillName);
  const items = fs.readdirSync(skillPath).filter((name) => name !== '.DS_Store');
  return items.length === 1 && items[0] === 'README.md';
};

const parseRepoUrl = (readmeText) => {
  const lines = readmeText.split(/\r?\n/);
  for (let i = 0; i < lines.length; i += 1) {
    if (lines[i].trim() === '## Repository') {
      for (let j = i + 1; j < lines.length; j += 1) {
        const line = lines[j].trim();
        if (line) return line;
      }
    }
  }
  return null;
};

const parseGithubUrl = (urlString) => {
  let url;
  try {
    url = new URL(urlString);
  } catch (err) {
    return null;
  }
  if (url.hostname !== 'github.com') return null;
  const parts = url.pathname.split('/').filter(Boolean);
  if (parts.length < 2) return null;
  const owner = parts[0];
  const repo = parts[1].replace(/\.git$/, '');
  let branch = 'main';
  let repoPath = '';

  if ((parts[2] === 'tree' || parts[2] === 'blob') && parts.length >= 4) {
    branch = parts[3];
    repoPath = parts.slice(4).join('/');
  }

  if (!repoPath) return null;
  return { owner, repo, branch, repoPath };
};

const selectSkills = () => {
  let skills = getSkillDirs();
  if (!options.all) {
    skills = skills.filter((skillName) => isReadmeOnly(skillName));
  }
  if (options.skills.length > 0) {
    const allow = new Set(options.skills);
    skills = skills.filter((skillName) => allow.has(skillName));
  }
  return skills;
};

const downloadTarball = (owner, repo, branch, destPath) => {
  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/tarball/${branch}`;
  const curlArgs = [
    '-4',
    '-L',
    '--fail',
    '--silent',
    '--show-error',
    '--retry', '3',
    '--retry-delay', '2',
    '--max-time', String(options.timeoutSeconds),
    '-o', destPath,
    apiUrl
  ];

  if (GITHUB_TOKEN) {
    curlArgs.unshift('-H', `Authorization: token ${GITHUB_TOKEN}`);
  }

  return run('curl', curlArgs);
};

const main = () => {
  const skills = selectSkills();
  if (skills.length === 0) {
    console.log('No skills matched the selection.');
    return;
  }

  const tasks = [];
  const errors = [];

  for (const skillName of skills) {
    const readmePath = path.join(SKILLS_DIR, skillName, 'README.md');
    if (!fs.existsSync(readmePath)) {
      errors.push({ skillName, error: 'README.md missing' });
      continue;
    }
    const readmeText = fs.readFileSync(readmePath, 'utf8');
    const repoUrl = parseRepoUrl(readmeText);
    if (!repoUrl) {
      errors.push({ skillName, error: 'Repository URL missing' });
      continue;
    }
    const repoInfo = parseGithubUrl(repoUrl);
    if (!repoInfo) {
      errors.push({ skillName, error: 'Repository URL invalid', repoUrl });
      continue;
    }
    tasks.push({ skillName, repoUrl, ...repoInfo });
  }

  const grouped = new Map();
  for (const task of tasks) {
    const key = `${task.owner}/${task.repo}#${task.branch}`;
    if (!grouped.has(key)) {
      grouped.set(key, { owner: task.owner, repo: task.repo, branch: task.branch, tasks: [] });
    }
    grouped.get(key).tasks.push(task);
  }

  ensureDir(TEMP_ROOT);
  ensureDir(EXTRACT_ROOT);

  for (const [key, group] of grouped.entries()) {
    const isLocalRepo = LOCAL_REPO_SLUG === `${group.owner}/${group.repo}`;
    const tarballPath = path.join(TEMP_ROOT, `${group.owner}__${group.repo}__${group.branch}.tar.gz`);
    const extractDir = path.join(EXTRACT_ROOT, `${group.owner}__${group.repo}__${group.branch}`);

    if (options.verbose) {
      console.log(`\nProcessing ${key}`);
    }

    if (!options.dryRun && !isLocalRepo) {
      if (fs.existsSync(tarballPath)) fs.rmSync(tarballPath, { force: true });
      if (fs.existsSync(extractDir)) fs.rmSync(extractDir, { recursive: true, force: true });
      ensureDir(extractDir);

      const downloaded = downloadTarball(group.owner, group.repo, group.branch, tarballPath);
      if (!downloaded) {
        errors.push({ skillName: key, error: 'Download failed' });
        continue;
      }

      const extracted = run('tar', ['-xzf', tarballPath, '-C', extractDir]);
      if (!extracted) {
        errors.push({ skillName: key, error: 'Extract failed' });
        continue;
      }
    }

    let rootPath = LOCAL_REPO_ROOT;
    if (!isLocalRepo) {
      const rootEntries = fs.readdirSync(extractDir, { withFileTypes: true });
      const rootDir = rootEntries.find((entry) => entry.isDirectory());
      if (!rootDir) {
        errors.push({ skillName: key, error: 'Missing root dir after extract' });
        continue;
      }
      rootPath = path.join(extractDir, rootDir.name);
    }

    for (const task of group.tasks) {
      const srcPath = path.join(rootPath, task.repoPath);
      const destFolderName = path.basename(task.repoPath) || task.skillName;
      const destPath = path.join(SKILLS_DIR, task.skillName, destFolderName);

      if (!fs.existsSync(srcPath)) {
        errors.push({ skillName: task.skillName, error: 'Source path missing', repoPath: task.repoPath });
        continue;
      }

      if (fs.existsSync(destPath)) {
        if (!options.force) {
          if (options.verbose) {
            console.log(`- Skip existing ${destPath}`);
          }
          continue;
        }
        if (!options.dryRun) {
          fs.rmSync(destPath, { recursive: true, force: true });
        }
      }

      if (options.verbose || options.dryRun) {
        console.log(`- Copy ${task.skillName} -> ${destFolderName}`);
      }
      if (!options.dryRun) {
        fs.cpSync(srcPath, destPath, { recursive: true });
      }
    }

    if (!options.dryRun && !isLocalRepo) {
      fs.rmSync(tarballPath, { force: true });
      fs.rmSync(extractDir, { recursive: true, force: true });
    }
  }

  if (errors.length > 0) {
    console.log('\nErrors:');
    for (const err of errors) {
      const detail = [err.error, err.repoPath, err.repoUrl].filter(Boolean).join(' | ');
      console.log(`- ${err.skillName}: ${detail}`);
    }
  } else {
    console.log('\nAll skills processed successfully.');
  }
};

main();
