const fs = require('fs');
const db = require('./db');

async function scriptImportar() {
  try {
    // Lee el JSON que descargaste de GitHub
    const rawData = fs.readFileSync('./data/exercises.json', 'utf8');
    const exercises = JSON.parse(rawData);

    console.log(`Iniciando importación de ${exercises.length} ejercicios...`);

    for (const ex of exercises) {
      const query = `
        INSERT INTO exercises (
          id, name, category, body_part, equipment, 
          instructions_en, muscle_group, target, image, gif_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        ON CONFLICT (id) DO NOTHING;
      `;
      
      const values = [
        ex.id, 
        ex.name, 
        ex.category, 
        ex.body_part, 
        ex.equipment, 
        ex.instructions_en ? ex.instructions_en.join(' ') : '', // Convertir array a texto
        ex.muscle_group, 
        ex.target, 
        `images/${ex.id}.jpg`, 
        `videos/${ex.id}.gif`
      ];

      await db.query(query, values);
    }

    console.log("✅ ¡Base de datos poblada con éxito!");
    process.exit();
  } catch (err) {
    console.error("❌ Error importando:", err);
    process.exit(1);
  }
}

scriptImportar();