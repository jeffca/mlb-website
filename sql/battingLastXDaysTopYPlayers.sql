SELECT
    b.player_id,
    ba.name,
    SUM(b.{{metric}}),
    SUM(b.ab)
FROM
    batting b
JOIN games g ON b.event_id = g.event_id AND b.team_id = g.team_id
JOIN batters ba ON ba.player_id = b.player_id
WHERE
    g.date_est >= DATE('now', ?)
GROUP BY
    1,
    2
ORDER BY
    3 DESC,
    4 ASC
LIMIT ?
OFFSET ?
