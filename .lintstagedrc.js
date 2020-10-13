module.exports = {
  '*.ts': 'eslint --cache --ext .ts',
  '*.json': [
    'prettier --parser json-stringify --write',
    'git diff --exit-code --quiet'
  ],
  'package.json': [
    'npx fixpack',
    'prettier --parser json-stringify --write',
    'git diff --exit-code --quiet'
  ],
  'package-lock.json': 'node -e "process.exitCode = 1;"'
};
