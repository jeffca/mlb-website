SELECT
    b.player_id,
    ba.name,
    t.nickname as team,
    opp.nickname as opponent,
    SUM(b.{{metric}}) as metric,
    SUM(b.ab) as ab
FROM
    batting b
JOIN games g ON b.event_id = g.event_id AND b.team_id = g.team_id
JOIN batters ba ON ba.player_id = b.player_id
JOIN schedule s ON (s.home_team_id = t.id OR s.away_team_id = t.id)
JOIN teams t ON b.team_id = t.id
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
    1,
    2,
    3,
    4
ORDER BY
    5 DESC,
    6 ASC
LIMIT ?
