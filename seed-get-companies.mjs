import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function getCompanies() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    const [rows] = await connection.execute(
      'SELECT id, name, industry FROM companies ORDER BY name'
    );
    
    console.log(`Total companies: ${rows.length}\n`);
    
    // Group by industry
    const byIndustry = {};
    rows.forEach(row => {
      if (!byIndustry[row.industry]) {
        byIndustry[row.industry] = [];
      }
      byIndustry[row.industry].push(row.name);
    });
    
    // Print by industry
    for (const [industry, companies] of Object.entries(byIndustry).sort()) {
      console.log(`\n${industry} (${companies.length}):`);
      companies.forEach(name => console.log(`  - ${name}`));
    }
  } finally {
    await connection.end();
  }
}

getCompanies().catch(err => {
  console.error('Error:', err);
  process.exit(1);
});
