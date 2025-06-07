import express from 'express';
import sqlite3 from 'sqlite3';
import fs from 'fs/promises';  

const app = express();
const port = 3010;
import cors from 'cors';


const allowedOrigins = ['http://localhost:5173', 'http://127.0.0.1:5173'];

const corsOptions = {
  origin: function (origin, callback) {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  optionsSuccessStatus: 200
};

app.use(cors(corsOptions));
// Connect to SQLite database
const db = new sqlite3.Database('../mlb_data/mlb_data.db', (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to SQLite database');
    }
});


app.get('/teams', async (req, res) => {
    try {
        const query = await fs.readFile('./sql/teams.sql', 'utf-8');
        db.all(query, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to read SQL file: ' + err.message });
    }
});


app.get('/teams/batting/:metric/last/:days', async (req, res) => {
    try {
        const allowedMetrics = ['h', 'r', 'rbi', 'hr', 'bb', 'k', 'ab'];
        const metric = req.params.metric;
        if (!allowedMetrics.includes(metric)) {
            return res.status(400).json({ error: 'Invalid metric' });
        }
        const days = parseInt(req.params.days);
        const daysParam = `-${days} days`;

        let query = await fs.readFile('./sql/teamsHighestMetricLastXDays.sql', 'utf-8');
        query = query.replace(/{{metric}}/g, metric);

        db.all(query, [daysParam], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });    
    } catch (err) {
        res.status(500).json({ error: 'Failed to read SQL file: ' + err.message });
    }
});


app.get('/teams/today/batting/:metric/last/:days', async (req, res) => {
    try {
        const allowedMetrics = ['h', 'r', 'rbi', 'hr', 'bb', 'k', 'ab'];
        const metric = req.params.metric;
        if (!allowedMetrics.includes(metric)) {
            return res.status(400).json({ error: 'Invalid metric' });
        }
        const days = parseInt(req.params.days);
        const daysParam = `-${days} days`;

        let query = await fs.readFile('./sql/teamsTodayHighestMetricLastXDays.sql', 'utf-8');
        query = query.replace(/{{metric}}/g, metric);

        db.all(query, [daysParam], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });    
    } catch (err) {
        res.status(500).json({ error: 'Failed to read SQL file: ' + err.message });
    }
});


app.get('/schedule', async (req, res) => {
    try {
        const query = await fs.readFile('./sql/schedule.sql', 'utf-8');
        db.all(query, (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to read SQL file: ' + err.message });
    }
});

app.get('/batting/:metric/top/:limit/last/:days/page/:page', async (req, res) => {
    try {
        const allowedMetrics = ['h', 'r', 'rbi', 'hr', 'bb', 'k', 'ab', 'avg', 'obp', 'slg'];
        const metric = req.params.metric;
        if (!allowedMetrics.includes(metric)) {
            return res.status(400).json({ error: 'Invalid metric' });
        }
        const limit = parseInt(req.params.limit);
        const days = parseInt(req.params.days);
        const page = parseInt(req.params.page);
        const daysParam = `-${days} days`;
        let pageParam;
        if (page == 1) {
            pageParam = 0;
        } else {
            pageParam = limit * (page - 1)
        }
        let query = await fs.readFile('./sql/battingLastXDaysTopYPlayers.sql', 'utf-8');
        query = query.replace(/{{metric}}/g, metric);

        db.all(query, [daysParam, limit, pageParam], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to read SQL file: ' + err.message });
    }
});


app.get('/batting/today/:metric/top/:limit/last/:days', async (req, res) => {
    try {
        const allowedMetrics = ['h', 'r', 'rbi', 'hr', 'bb', 'k', 'ab', 'avg', 'obp', 'slg'];
        const metric = req.params.metric;
        if (!allowedMetrics.includes(metric)) {
            return res.status(400).json({ error: 'Invalid metric' });
        }
        const limit = parseInt(req.params.limit);
        const days = parseInt(req.params.days);
        const daysParam = `-${days} days`;
        let query = await fs.readFile('./sql/battingTodayLastXDaysTopYPlayers.sql', 'utf-8');
        query = query.replace(/{{metric}}/g, metric);

        db.all(query, [daysParam, limit], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to read SQL file: ' + err.message });
    }
});


app.get('/pitching/:metric/top/:limit/last/:days/page/:page', async (req, res) => {
    try {
        const allowedMetrics = ['h', 'bb', 'k', 'ip', 'hr'];
        const metric = req.params.metric;
        if (!allowedMetrics.includes(metric)) {
            return res.status(400).json({ error: 'Invalid metric' });
        }
        const limit = parseInt(req.params.limit);
        const days = parseInt(req.params.days);
        const page = parseInt(req.params.page);
        const daysParam = `-${days} days`;

        let pageParam;
        if (page == 1) {
            pageParam = 0;
        } else {
            pageParam = limit * (page - 1)
        }

        let query = await fs.readFile('./sql/pitchingLastXDaysTopYPlayers.sql', 'utf-8');
        query = query.replace(/{{metric}}/g, metric);

        db.all(query, [daysParam, limit, pageParam], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to read SQL file: ' + err.message });
    }
});


app.get('/pitching/today/:metric/last/:days', async (req, res) => {
    try {
        const allowedMetrics = ['h', 'bb', 'k', 'ip', 'hr', 'er'];
        const metric = req.params.metric;
        if (!allowedMetrics.includes(metric)) {
            return res.status(400).json({ error: 'Invalid metric' });
        }
        const days = parseInt(req.params.days);
        const daysParam = `-${days} days`;

        let query = await fs.readFile('./sql/pitchingTodayLastXDaysTopYPlayers.sql', 'utf-8');
        query = query.replace(/{{metric}}/g, metric);

        db.all(query, [daysParam], (err, rows) => {
            if (err) {
                res.status(500).json({ error: err.message });
                return;
            }
            res.json(rows);
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to read SQL file: ' + err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
