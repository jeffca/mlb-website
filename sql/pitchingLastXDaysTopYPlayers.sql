SELECT
    p.player_id,
    t.team,
    pi.name,
    SUM(p.{{metric}}),
    SUM(p.ip)
FROM
    pitching p
JOIN games g ON p.event_id = g.event_id AND p.team_id = g.team_id
JOIN pitchers pi ON pi.player_id = p.player_id
JOIN teams t ON p.team_id = t.id
WHERE
    g.date_est >= DATE('now', ?)
GROUP BY
    1,
    2,
    3
ORDER BY
    4 DESC,
    5 ASC
LIMIT ?
OFFSET ?
