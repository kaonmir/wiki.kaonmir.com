---
title:
aliases:
tags:
  - 씨앗
---
### Non-unique ([문제](https://leetcode.com/problems/investments-in-2016))

```sql
SELECT * FROM EMPLOYEE
GROUP BY SALARY
HAVING COUNT(*) > 1
```

Unique를 원하면 `HAVING COUNT(*) = 1`하면 됩니다.

### Value ?? Null ([문제](https://leetcode.com/problems/second-highest-salary))

값이 없으면 NULL을 표시한다. Subuqery는 값을 2개 이상 반환할 수 없다.

```sql
SELECT (
    SELECT * FROM EMPLOYEE
    LIMIT 1
)
```

### JOIN vs UNION
- `JOIN`: 수평 결합(열 추가)
- `UNION`: 수직 결합(행 추가)
- `UNION ALL`: 중복을 허용한 UNION

### 변수화
```sql
WITH EMPLOYEE_SALARY AS (
    ...
)
SELECT * FROM EMPLOYEE
WHERE salary = (SELECT MAX(salary) FROM EMPLOYEE_SALARY)
```

### LIMIT 없이 OFFSET 하기
Row number를 column에 추가하고 WHERE를 할 수 있습니다.

```sql
SELECT
    ROW_NUMBER() OVER (ORDER BY id) AS rn,
    c.*
FROM CUSTOMER c
WHERE rn > 7;
```

### Window Function ([문제](https://leetcode.com/problems/restaurant-growth))

```sql
SELECT 
  윈도우함수([컬럼]) OVER ([PARTITION BY 컬럼] [ORDER BY 컬럼] [ROWS|RANGE ...])
FROM 테이블;
```

**기본 문법**
- `PARTITION BY`: 데이터를 소그룹으로 나누어 각 그룹별로 연산 수행
- `ORDER BY`: 그룹 내에서 연산 적용 순서 지정
- `ROWS/RANGE`: 윈도우의 범위(행 기준, 값 기준 등) 지정
    - ROWS: 행 번호를 기준
        - `ROWS 3 PRECEDING`: 물리적인 앞 3개 행에 대해 연산
    - RANGE: 값을 기준
        - `RANGE BETWEEN INTERVAL 6 DAY PRECEDING`: 이전 6일(오늘 미포함) 동안에 대해 연산

**윈도우 함수**

| 분류       | 주요 함수 및 설명                | 설명                     |
| -------- | ------------------------- | ---------------------- |
| 순위 함수    | ROW_NUMBER                | 고유 순번                  |
|          | RANK                      | 2등이 3명이면, 다음 등수는 5등부터  |
|          | DENSE_RANK                | 2등이 3명이라도, 다음 등수는 3등부터 |
| 집계 함수    | SUM, AVG, COUNT, MAX, MIN | 파티션별 누적합, 평균, …        |
| 행 참조 함수  | LAG                       | 이전 행 값                 |
|          | LEAD                      | 다음 행 값                 |
|          | FIRST_VALUE, LAST_VALUE   | 파티션 내 첫/마지막 값          |
| 비율/분포 함수 | NTILE(n)                  | n등분 그룹                 |
|          | PERCENT_RANK, CUME_DIST   | 누적/백분율 순위              |
|          | RATIO_TO_REPORT           | 비율                     |


