import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

async function checkRange() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    const [stats] = await connection.execute(
      'SELECT MIN(CAST(turnoverRate AS DECIMAL(5,2))) as minTurnover, MAX(CAST(turnoverRate AS DECIMAL(5,2))) as maxTurnover, COUNT(*) as total FROM companies WHERE turnoverRate IS NOT NULL'
    );
    
    console.log(`Total companies with turnover: ${stats[0].total}`);
    console.log(`Turnover range: ${stats[0].minTurnover}% - ${stats[0].maxTurnover}%`);
    console.log(`Range span: ${(stats[0].maxTurnover - stats[0].minTurnover).toFixed(1)}%`);
  } finally {
    await connection.end();
  }
}

checkRange().catch(err => console.error(err));
