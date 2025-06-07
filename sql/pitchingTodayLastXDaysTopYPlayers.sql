SELECT
    p.player_id,
    pi.name,
    t.nickname AS team,
    opp.nickname AS opponent,
    SUM(p.{{metric}}) as metric,
    SUM(p.ip) as ip
FROM
    pitching p
JOIN games g ON p.event_id = g.event_id AND p.team_id = g.team_id
JOIN pitchers pi ON pi.player_id = p.player_id
JOIN schedule s ON (
        s.home_team_starting_pitcher_id = pi.player_id
        OR s.away_team_starting_pitcher_id = pi.player_id
    )
JOIN 
    teams t ON p.team_id = t.id
LEFT JOIN teams opp
    ON opp.id = 
        CASE
            WHEN s.home_team_starting_pitcher_id = pi.player_id THEN s.away_team_id
            WHEN s.away_team_starting_pitcher_id = pi.player_id THEN s.home_team_id
            ELSE NULL
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
