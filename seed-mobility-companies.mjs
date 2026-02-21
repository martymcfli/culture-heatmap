import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

// Enterprise Mobility and Staffing Companies with high turnover
const MOBILITY_COMPANIES = [
  {
    name: "Alphasights",
    industry: "Staffing",
    headquartersCity: "London",
    headquartersState: "UK",
    sizeRange: "1001-5000",
    turnoverRate: 45.2,
    avgTenure: 1.5,
  },
  {
    name: "Uber Eats",
    industry: "Transportation",
    headquartersCity: "San Francisco",
    headquartersState: "CA",
    sizeRange: "5000+",
    turnoverRate: 52.8,
    avgTenure: 1.2,
  },
  {
    name: "DoorDash Dasher",
    industry: "Delivery",
    headquartersCity: "San Francisco",
    headquartersState: "CA",
    sizeRange: "5000+",
    turnoverRate: 58.5,
    avgTenure: 1.0,
  },
  {
    name: "Instacart Shopper",
    industry: "Delivery",
    headquartersCity: "San Francisco",
    headquartersState: "CA",
    sizeRange: "5000+",
    turnoverRate: 61.2,
    avgTenure: 0.9,
  },
  {
    name: "TaskRabbit",
    industry: "Staffing",
    headquartersCity: "San Francisco",
    headquartersState: "CA",
    sizeRange: "501-1000",
    turnoverRate: 48.5,
    avgTenure: 1.3,
  },
  {
    name: "Fiverr",
    industry: "Freelance",
    headquartersCity: "Tel Aviv",
    headquartersState: "Israel",
    sizeRange: "501-1000",
    turnoverRate: 42.1,
    avgTenure: 1.6,
  },
  {
    name: "Upwork",
    industry: "Freelance",
    headquartersCity: "Santa Clara",
    headquartersState: "CA",
    sizeRange: "501-1000",
    turnoverRate: 38.9,
    avgTenure: 1.8,
  },
  {
    name: "Flex",
    industry: "Staffing",
    headquartersCity: "San Francisco",
    headquartersState: "CA",
    sizeRange: "1001-5000",
    turnoverRate: 55.3,
    avgTenure: 1.1,
  },
  {
    name: "Wonolo",
    industry: "Staffing",
    headquartersCity: "San Francisco",
    headquartersState: "CA",
    sizeRange: "201-500",
    turnoverRate: 51.7,
    avgTenure: 1.2,
  },
  {
    name: "Workana",
    industry: "Freelance",
    headquartersCity: "Buenos Aires",
    headquartersState: "Argentina",
    sizeRange: "201-500",
    turnoverRate: 44.2,
    avgTenure: 1.4,
  },
  {
    name: "PeoplePerHour",
    industry: "Freelance",
    headquartersCity: "London",
    headquartersState: "UK",
    sizeRange: "51-200",
    turnoverRate: 39.8,
    avgTenure: 1.7,
  },
  {
    name: "Guru",
    industry: "Freelance",
    headquartersCity: "Philadelphia",
    headquartersState: "PA",
    sizeRange: "51-200",
    turnoverRate: 41.5,
    avgTenure: 1.6,
  },
  {
    name: "Toptal",
    industry: "Staffing",
    headquartersCity: "San Francisco",
    headquartersState: "CA",
    sizeRange: "501-1000",
    turnoverRate: 35.2,
    avgTenure: 2.0,
  },
  {
    name: "Gun.io",
    industry: "Staffing",
    headquartersCity: "San Francisco",
    headquartersState: "CA",
    sizeRange: "51-200",
    turnoverRate: 33.5,
    avgTenure: 2.1,
  },
  {
    name: "Arc.dev",
    industry: "Staffing",
    headquartersCity: "San Francisco",
    headquartersState: "CA",
    sizeRange: "201-500",
    turnoverRate: 36.8,
    avgTenure: 1.9,
  },
];

async function addMobilityCompanies() {
  const connection = await mysql.createConnection(process.env.DATABASE_URL);
  
  try {
    console.log('Starting to add enterprise mobility and staffing companies...\n');
    
    let added = 0;
    let skipped = 0;
    
    for (const company of MOBILITY_COMPANIES) {
      try {
        // Check if company already exists
        const [existing] = await connection.execute(
          'SELECT id FROM companies WHERE name = ?',
          [company.name]
        );
        
        if (existing.length > 0) {
          console.log(`⚠ Already exists: ${company.name}`);
          skipped++;
          continue;
        }
        
        // Insert new company
        const result = await connection.execute(
          `INSERT INTO companies 
           (name, industry, headquartersCity, headquartersState, sizeRange, turnoverRate, avgTenure, createdAt, updatedAt) 
           VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
          [
            company.name,
            company.industry,
            company.headquartersCity,
            company.headquartersState,
            company.sizeRange,
            company.turnoverRate,
            company.avgTenure,
          ]
        );
        
        console.log(`✓ Added ${company.name}: ${company.turnoverRate}% turnover, ${company.avgTenure} years avg tenure`);
        added++;
      } catch (err) {
        console.error(`✗ Error adding ${company.name}:`, err.message);
      }
    }
    
    console.log(`\n✅ Complete: ${added} added, ${skipped} already existed`);
    
    // Show summary
    const [summary] = await connection.execute(
      'SELECT COUNT(*) as total FROM companies'
    );
    console.log(`\nDatabase now has ${summary[0].total} total companies`);
  } finally {
    await connection.end();
  }
}

addMobilityCompanies().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
