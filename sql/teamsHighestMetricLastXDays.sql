SELECT
    t.team,
    ROUND(CAST(sum(b.{{metric}}) * 1.0/sum(b.ab) AS FLOAT),3) AS metric_rate
FROM
    batting b
JOIN games g ON b.event_id = g.event_id AND b.team_id = g.team_id
JOIN teams t ON b.team_id = t.id
WHERE
    g.date_est >= DATE('now', ?)
GROUP BY
    1
ORDER BY
    2 DESC
