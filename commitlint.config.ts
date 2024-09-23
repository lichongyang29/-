import type { UserConfig } from '@commitlint/types';
const Configuration: UserConfig = {
  extends: ['@commitlint/config-conventional'],
  rules: {
    'type-enum': [
      2,
      'always',
      [
        'feat', // New features 新版本
        'fix', // Bug fixes 修复bug
        'chore', // Maintenance tasks  日常维护
        'ci', //CI configuration changes  CI配置更改
        'docs', // Documentation updates  文档更新
        'perf', // Performance improvements 性能优化
        'refactor', // Code refactoring 代码重构
        'revert', // Revert to previous commit  回滚(恢复到之前的提交)
        'style', // Code style changes  代码风格
        'test', // Adding or updating tests  添加或更新测试
      ],
    ],
  },
};
module.exports = Configuration;
