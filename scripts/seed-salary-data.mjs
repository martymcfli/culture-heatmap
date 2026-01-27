import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Salary data by role and level (base salary, bonus %, equity value)
const salaryTemplates = {
  "Software Engineer": {
    "Entry": { base: 120000, bonus: 10, equity: 50000 },
    "Mid": { base: 180000, bonus: 15, equity: 100000 },
    "Senior": { base: 250000, bonus: 20, equity: 200000 },
    "Lead": { base: 320000, bonus: 25, equity: 300000 },
  },
  "Product Manager": {
    "Entry": { base: 110000, bonus: 15, equity: 40000 },
    "Mid": { base: 170000, bonus: 20, equity: 80000 },
    "Senior": { base: 240000, bonus: 25, equity: 150000 },
    "Director": { base: 320000, bonus: 30, equity: 250000 },
  },
  "Data Scientist": {
    "Entry": { base: 115000, bonus: 12, equity: 45000 },
    "Mid": { base: 175000, bonus: 18, equity: 90000 },
    "Senior": { base: 245000, bonus: 22, equity: 180000 },
    "Lead": { base: 310000, bonus: 28, equity: 280000 },
  },
  "UX/UI Designer": {
    "Entry": { base: 80000, bonus: 8, equity: 30000 },
    "Mid": { base: 130000, bonus: 12, equity: 60000 },
    "Senior": { base: 180000, bonus: 15, equity: 100000 },
    "Lead": { base: 240000, bonus: 20, equity: 150000 },
  },
  "DevOps Engineer": {
    "Entry": { base: 125000, bonus: 11, equity: 55000 },
    "Mid": { base: 190000, bonus: 16, equity: 110000 },
    "Senior": { base: 270000, bonus: 21, equity: 220000 },
    "Lead": { base: 340000, bonus: 26, equity: 320000 },
  },
  "Sales Executive": {
    "Entry": { base: 60000, bonus: 50, equity: 20000 },
    "Mid": { base: 100000, bonus: 60, equity: 50000 },
    "Senior": { base: 150000, bonus: 75, equity: 100000 },
    "Manager": { base: 200000, bonus: 100, equity: 150000 },
  },
  "Marketing Manager": {
    "Entry": { base: 70000, bonus: 10, equity: 25000 },
    "Mid": { base: 120000, bonus: 15, equity: 50000 },
    "Senior": { base: 170000, bonus: 20, equity: 100000 },
    "Director": { base: 240000, bonus: 25, equity: 150000 },
  },
  "Finance Analyst": {
    "Entry": { base: 75000, bonus: 15, equity: 20000 },
    "Mid": { base: 130000, bonus: 25, equity: 50000 },
    "Senior": { base: 190000, bonus: 35, equity: 100000 },
    "Manager": { base: 260000, bonus: 50, equity: 150000 },
  },
};

try {
  // Get all companies
  const [companies] = await connection.execute("SELECT id FROM companies LIMIT 200");
  console.log(`Found ${companies.length} companies. Seeding salary data...`);

  let totalAdded = 0;

  for (const company of companies) {
    const companyId = company.id;
    const roles = Object.keys(salaryTemplates);
    
    // Add 3-5 random roles per company
    const numRoles = Math.floor(Math.random() * 3) + 3;
    const selectedRoles = roles.sort(() => Math.random() - 0.5).slice(0, numRoles);

    for (const role of selectedRoles) {
      const levels = Object.keys(salaryTemplates[role]);
      
      for (const level of levels) {
        const template = salaryTemplates[role][level];
        const baseSalary = template.base + (Math.random() * 20000 - 10000); // Add variance
        const bonusAmount = (baseSalary * template.bonus) / 100;
        const equityValue = template.equity + (Math.random() * 50000 - 25000);
        const totalComp = baseSalary + bonusAmount + equityValue;

        await connection.execute(
          `INSERT INTO salaryData 
           (companyId, jobTitle, level, baseSalary, bonus, equity, totalCompensation, currency, location, yearsExperience, dataSource, lastUpdated) 
           VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
          [
            companyId,
            role,
            level,
            baseSalary.toFixed(2),
            bonusAmount.toFixed(2),
            equityValue.toFixed(2),
            totalComp.toFixed(2),
            "USD",
            "United States",
            level === "Entry" ? 0 : level === "Mid" ? 3 : level === "Senior" ? 7 : 10,
            "Internal Survey",
            new Date().toISOString().split("T")[0],
          ]
        );
        totalAdded++;
      }
    }

    if (totalAdded % 50 === 0) {
      console.log(`✓ Added salary data for ${totalAdded} role/level combinations...`);
    }
  }

  console.log(`\n✅ Successfully seeded ${totalAdded} salary data entries!`);
} catch (error) {
  console.error("Error seeding salary data:", error);
} finally {
  await connection.end();
}
