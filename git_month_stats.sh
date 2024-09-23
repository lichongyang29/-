#!/bin/bash

# 初始化月份计数器
months=()

# 获取所有独特的月份（格式为YYYY-MM），假设日志跨度内年份不会变化
while read -r line; do
    month=$(date -d "$line" +%Y-%m)
    if [[ ! " ${months[*]} " =~ " ${month} " ]]; then
        months+=("$month")
    fi
done < <(git log --format="%ad" --date=short | sort -u)

# 对每个作者统计每个月的提交次数
for month in "${months[@]}"; do
    echo "月份: $month"
    echo "作者,提交次数"
    git log --since="$month-01" --until="$month-31 23:59:59" \
            --date=format:'%Y-%m-%d %H:%M:%S' \
            --pretty=format:"%an" \
            | sort | uniq -c | awk -v month="$month" '{print $2 ",",$1}'
done > author_commits_by_month.csv