SELECT 
    *
FROM
    schedule
WHERE
    completed = 0
AND
    date_est >= DATE('now', '-1 days')
;