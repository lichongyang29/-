#!/bin/bash

set -e

> gitlog.md

echo "作者统计信息:" >> gitlog.md
echo "" >> gitlog.md

# 添加作者提交统计
git shortlog -sn --no-merges >> gitlog.md

echo "" >> gitlog.md
echo "----------------------------------------" >> gitlog.md
echo "" >> gitlog.md

echo "版本信息（按作者分组并按时间排序）:" >> gitlog.md
echo "" >> gitlog.md
echo "时间,作者,提交信息,分支号" >> gitlog.md

# 获取所有独特的作者名
authors=$(git shortlog -sn --no-merges | awk '{print $2}')

echo $authors

for author in $authors; do
    echo "" >> gitlog.md
    echo "作者: $author" >> gitlog.md
    echo "" >> gitlog.md
    
    # 对每个作者的提交按时间排序
    git log --author="$author" \
            --date=format:'%Y-%m-%d %H:%M:%S' \
            --pretty=format:"%n%cd %an: %s - %h" \
            --reverse >> gitlog.md

   
done

echo "" >> gitlog.md
echo "----------------------------------------" >> gitlog.md
echo "" >> gitlog.md