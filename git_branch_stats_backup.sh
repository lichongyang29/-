#!/bin/bash

set -e

# 清空或创建gitlog.md
> gitlog.md

echo "" >> gitlog.md
echo "作者统计信息：" >> gitlog.md
echo "" >> gitlog.md

# 添加作者提交统计
git shortlog -sn >> gitlog.md

# 分割线
echo "" >> gitlog.md
echo "----------------------------------------" >> gitlog.md
echo "" >> gitlog.md

# 输出分支信息
echo "版本信息：" >> gitlog.md
echo "" >> gitlog.md
echo "时间,作者,提交信息,分支号" >> gitlog.md


# 添加指定时间段和作者的提交日志
git log  \
--date=format:'%Y-%m-%d %H:%M:%S' \
--pretty=format:"%n%cd %an: %s - %h" \
--reverse >> gitlog.md

# 添加表头
echo "" >> gitlog.md
echo "----------------------------------------" >> gitlog.md
echo "" >> gitlog.md

echo "分支统计信息：" >> gitlog.md
echo "" >> gitlog.md
echo "分支,提交次数,修改文件" >> gitlog.md
echo "" >> gitlog.md


# 获取并遍历本地分支
for branch in $(git branch); do
    [ "$branch" != "*" ] || continue

    echo "Processing branch: $branch"
    git checkout "$branch"

    # 统计提交次数
    commits=$(git rev-list --count HEAD)

    # 统计不同文件的变更次数
    files_changed=$(git log --pretty=format: --name-only --diff-filter=ACM | sort -u | wc -l)

    # 将统计结果追加到gitlog.md
    echo "$branch,$commits,$files_changed" >> gitlog.md
done

echo "All data has been saved to gitlog.md."