const express = require('express');
const router = express.Router();
const db = require('../db'); // MySQL connection

// Save Quality Data
router.post('/save-quality-data', async (req, res) => {
    const { partNumber, partName, materialSpec, inspectedBy, verifiedBy, status, date, time, measurements } = req.body;

    try {
        // Insert into quality_data table
        const mainQuery = `
            INSERT INTO quality_data (part_number, part_name, material_spec, inspected_by, verified_by, status, date, time)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db.promise().execute(mainQuery, [
            partNumber,
            partName,
            materialSpec,
            inspectedBy,
            verifiedBy,
            status,
            date,
            time,
        ]);

        const qualityId = result.insertId; // ID of the inserted row

        // Insert into measurement_data table
        const measurementQueries = measurements.map((m) => {
            return db.promise().execute(
                `INSERT INTO measurement_data (quality_id, nominal_value, tol_plus, tol_minus, usl, lsl, instrument_used, ctc_ctq, remarks)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [qualityId, m.nominalValue, m.tolPlus, m.tolMinus, m.usl, m.lsl, m.instrumentUsed, m.ctcCtq, m.remarks]
            );
        });

        await Promise.all(measurementQueries);

        res.status(200).json({ message: 'Data saved successfully!' });
    } catch (error) {
        console.error('Error saving data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Fetch Inspection Data
router.get('/inspection-data', async (req, res) => {
    const { from_date, to_date, part_number } = req.query;
    let query = `SELECT * FROM quality_data WHERE 1=1`;
    const params = [];

    if (from_date) {
        query += ` AND date >= ?`;
        params.push(from_date);
    }
    if (to_date) {
        query += ` AND date <= ?`;
        params.push(to_date);
    }
    if (part_number) {
        query += ` AND part_number = ?`;
        params.push(part_number);
    }

    try {
        const [rows] = await db.promise().execute(query, params);
        res.status(200).json(rows);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Download Data
router.get('/download-data', async (req, res) => {
    const { from_date, to_date, part_number } = req.query;
    let query = `SELECT * FROM quality_data WHERE 1=1`;
    const params = [];

    if (from_date) {
        query += ` AND date >= ?`;
        params.push(from_date);
    }
    if (to_date) {
        query += ` AND date <= ?`;
        params.push(to_date);
    }
    if (part_number) {
        query += ` AND part_number = ?`;
        params.push(part_number);
    }

    try {
        const [rows] = await db.promise().execute(query, params);
        res.setHeader('Content-Disposition', 'attachment; filename="inspection_data.csv"');
        res.setHeader('Content-Type', 'text/csv');

        const csvContent = rows
            .map(row => Object.values(row).join(','))
            .join('\n');
        res.send(csvContent);
    } catch (error) {
        console.error('Error downloading data:', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = router;
