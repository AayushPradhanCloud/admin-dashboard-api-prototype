/* eslint-env node */
module.exports = {
  '*.ts': ['eslint --fix --max-warnings 0', 'prettier --write'],
  '*.{json,md,yml,yaml}': ['prettier --write'],
};
