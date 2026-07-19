const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');
const test = require('node:test');

const scriptPath = path.join(__dirname, 'sync-skills-from-readmes.js');

const createFixture = () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'skills-sync-test-'));
  fs.mkdirSync(path.join(root, 'scripts'));
  fs.mkdirSync(path.join(root, 'skills', 'broken'), { recursive: true });
  fs.copyFileSync(scriptPath, path.join(root, 'scripts', path.basename(scriptPath)));
  return root;
};

const runFixture = (root, args) =>
  spawnSync(process.execPath, ['scripts/sync-skills-from-readmes.js', ...args], {
    cwd: root,
    encoding: 'utf8'
  });

test('exits unsuccessfully when a selected skill cannot be synchronized', (t) => {
  const root = createFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const result = runFixture(root, ['--all', '--skills=broken']);

  assert.equal(result.status, 1);
  assert.match(result.stdout, /broken: README\.md missing/);
});

test('exits successfully when no skill matches the selection', (t) => {
  const root = createFixture();
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));

  const result = runFixture(root, ['--all', '--skills=missing']);

  assert.equal(result.status, 0);
  assert.match(result.stdout, /No skills matched the selection\./);
});
