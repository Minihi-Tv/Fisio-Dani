const db = require('../db');

exports.getExerciseById = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM exercises WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0) return res.status(404).json({ error: "No encontrado" });
    res.json(result.rows[0]);
  } catch (err) { res.status(500).json({ error: "Error de servidor" }); }
};

exports.getExercises = async (req, res) => {
  try {
    let { page = 1, limit = 12, body_part, equipment, name } = req.query;
    const offset = (page - 1) * limit;
    const values = [];
    const filters = [];

    if (body_part) { values.push(body_part); filters.push(`body_part = $${values.length}`); }
    if (equipment) { values.push(equipment); filters.push(`equipment = $${values.length}`); }
    if (name) { values.push(`%${name}%`); filters.push(`name ILIKE $${values.length}`); }

    const where = filters.length ? `WHERE ${filters.join(' AND ')}` : '';
    
    const count = await db.query(`SELECT COUNT(*) FROM exercises ${where}`, values);
    const data = await db.query(
      `SELECT * FROM exercises ${where} ORDER BY id LIMIT $${values.length + 1} OFFSET $${values.length + 2}`,
      [...values, limit, offset]
    );

    res.json({
      data: data.rows,
      totalPages: Math.ceil(parseInt(count.rows[0].count) / limit)
    });
  } catch (err) { res.status(500).json({ error: err.message }); }
};

exports.getRandomExercise = async (req, res) => {
  const result = await db.query('SELECT * FROM exercises ORDER BY RANDOM() LIMIT 1');
  res.json(result.rows[0]);
};

exports.getUniqueList = (col) => async (req, res) => {
  const result = await db.query(`SELECT DISTINCT ${col} FROM exercises WHERE ${col} IS NOT NULL ORDER BY ${col}`);
  res.json(result.rows.map(r => r[col]));
};
