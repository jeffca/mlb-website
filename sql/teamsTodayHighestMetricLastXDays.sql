SELECT
    t.nickname AS team,
    opp.nickname AS opponent,
    ROUND(CAST(SUM(b.{{metric}}) * 1.0 / SUM(b.ab) AS FLOAT), 3) AS metric_rate
FROM
    batting b
JOIN games g ON b.event_id = g.event_id AND b.team_id = g.team_id
JOIN teams t ON b.team_id = t.id
JOIN schedule s ON (s.home_team_id = t.id OR s.away_team_id = t.id)
JOIN teams opp ON opp.id = 
    CASE 
        WHEN s.home_team_id = t.id THEN s.away_team_id
        ELSE s.home_team_id
    END
WHERE
    s.completed = 0
    AND s.date_est >= DATE('now', '-1 days')
    AND g.date_est >= DATE('now', ?)
GROUP BY
    1,2
ORDER BY
    3 DESC
