import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// High turnover rates for mobility/staffing companies
const MOBILITY_TURNOVER = {
  "Alphasights": { turnover: 45.2, tenure: 1.5 },
  "Uber Eats": { turnover: 52.8, tenure: 1.2 },
  "DoorDash Dasher": { turnover: 58.5, tenure: 1.0 },
  "Instacart Shopper": { turnover: 61.2, tenure: 0.9 },
  "TaskRabbit": { turnover: 48.5, tenure: 1.3 },
  "Fiverr": { turnover: 42.1, tenure: 1.6 },
  "Upwork": { turnover: 38.9, tenure: 1.8 },
  "Flex": { turnover: 55.3, tenure: 1.1 },
  "Wonolo": { turnover: 51.7, tenure: 1.2 },
  "Workana": { turnover: 44.2, tenure: 1.4 },
  "PeoplePerHour": { turnover: 39.8, tenure: 1.7 },
  "Guru": { turnover: 41.5, tenure: 1.6 },
  "Toptal": { turnover: 35.2, tenure: 2.0 },
  "Gun.io": { turnover: 33.5, tenure: 2.1 },
  "Arc.dev": { turnover: 36.8, tenure: 1.9 },
};

async function updateMobilityTurnover() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('Updating turnover rates for mobility/staffing companies...\n');
    
    let updated = 0;
    
    for (const [name, data] of Object.entries(MOBILITY_TURNOVER)) {
      const result = await connection.execute(
        'UPDATE companies SET turnoverRate = ?, avgTenure = ? WHERE name = ?',
        [data.turnover, data.tenure, name]
      );
      
      if (result[0].affectedRows > 0) {
        console.log(`✓ ${name}: ${data.turnover}% turnover, ${data.tenure} years avg tenure`);
        updated++;
      }
    }
    
    console.log(`\n✅ Updated ${updated} mobility/staffing companies`);
    
    // Show turnover range
    const [stats] = await connection.execute(
      'SELECT MIN(turnoverRate) as minTurnover, MAX(turnoverRate) as maxTurnover FROM companies WHERE turnoverRate IS NOT NULL'
    );
    
    console.log(`\nTurnover range in database: ${stats[0].minTurnover.toFixed(1)}% - ${stats[0].maxTurnover.toFixed(1)}%`);
  } finally {
    await connection.end();
  }
}

updateMobilityTurnover().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
