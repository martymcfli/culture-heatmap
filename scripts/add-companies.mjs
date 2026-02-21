import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const newCompanies = [
  { name: 'BioBridge Global', domain: 'biobridgeglobal.com', industry: 'Healthcare Tech', sizeRange: '201-500', city: 'San Antonio', state: 'TX', country: 'USA' },
  { name: 'Chime', domain: 'chime.com', industry: 'Technology', sizeRange: '501-1000', city: 'San Francisco', state: 'CA', country: 'USA' },
];

const getCultureScores = (industry) => {
  const baseScores = {
    overallRating: 3.8 + Math.random() * 1.2,
    workLifeBalance: 3.5 + Math.random() * 1.5,
    compensationBenefits: 4.2 + Math.random() * 0.8,
    careerOpportunities: 4.0 + Math.random() * 1.0,
    cultureValues: 3.7 + Math.random() * 1.3,
    seniorManagement: 3.6 + Math.random() * 1.4,
    ceoApproval: 70 + Math.random() * 30,
    recommendToFriend: 65 + Math.random() * 35,
    reviewCount: Math.floor(100 + Math.random() * 900),
  };
  return baseScores;
};

try {
  console.log('Adding new companies...');
  
  for (const company of newCompanies) {
    const [companyResult] = await connection.execute(
      `INSERT INTO companies (name, domain, industry, sizeRange, headquartersCity, headquartersState, headquartersCountry)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE id=LAST_INSERT_ID(id)`,
      [
        company.name,
        company.domain,
        company.industry,
        company.sizeRange,
        company.city,
        company.state,
        company.country,
      ]
    );

    const companyId = companyResult.insertId;
    console.log(`Added company: ${company.name} (ID: ${companyId})`);

    const sources = ['glassdoor', 'indeed', 'comparably'];
    for (const source of sources) {
      const scores = getCultureScores(company.industry);
      await connection.execute(
        `INSERT INTO culture_scores (companyId, source, overallRating, workLifeBalance, compensationBenefits, careerOpportunities, cultureValues, seniorManagement, ceoApproval, recommendToFriend, reviewCount)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          companyId,
          source,
          scores.overallRating,
          scores.workLifeBalance,
          scores.compensationBenefits,
          scores.careerOpportunities,
          scores.cultureValues,
          scores.seniorManagement,
          scores.ceoApproval,
          scores.recommendToFriend,
          scores.reviewCount,
        ]
      );
    }

    for (let month = 5; month >= 0; month--) {
      const date = new Date();
      date.setMonth(date.getMonth() - month);
      const trendScore = 3.5 + Math.random() * 1.5;
      
      await connection.execute(
        `INSERT INTO culture_trends (companyId, month, value) VALUES (?, ?, ?)`,
        [companyId, date.toISOString().split('T')[0], trendScore]
      );
    }
  }

  console.log('Successfully added new companies!');
  await connection.end();
} catch (error) {
  console.error('Error adding companies:', error);
  process.exit(1);
}
