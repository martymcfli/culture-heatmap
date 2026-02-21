import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Sample companies data with culture scores
const companiesData = [
  // San Antonio Companies
  { name: 'Rackspace', domain: 'rackspace.com', industry: 'Cloud Computing', sizeRange: '1001-5000', city: 'San Antonio', state: 'TX', country: 'USA' },
  { name: 'USAA', domain: 'usaa.com', industry: 'Financial Services', sizeRange: '5000+', city: 'San Antonio', state: 'TX', country: 'USA' },
  
  // NYC Companies
  { name: 'Google NYC', domain: 'google.com', industry: 'Technology', sizeRange: '5000+', city: 'New York', state: 'NY', country: 'USA' },
  { name: 'Meta NYC', domain: 'meta.com', industry: 'Technology', sizeRange: '5000+', city: 'New York', state: 'NY', country: 'USA' },
  { name: 'Goldman Sachs', domain: 'goldmansachs.com', industry: 'Finance', sizeRange: '5000+', city: 'New York', state: 'NY', country: 'USA' },
  { name: 'Morgan Stanley', domain: 'morganstanley.com', industry: 'Finance', sizeRange: '5000+', city: 'New York', state: 'NY', country: 'USA' },
  { name: 'Citadel', domain: 'citadel.com', industry: 'Finance', sizeRange: '1001-5000', city: 'New York', state: 'NY', country: 'USA' },
  { name: 'Spotify', domain: 'spotify.com', industry: 'Technology', sizeRange: '1001-5000', city: 'New York', state: 'NY', country: 'USA' },
  
  // Major Tech Companies
  { name: 'Apple', domain: 'apple.com', industry: 'Technology', sizeRange: '5000+', city: 'Cupertino', state: 'CA', country: 'USA' },
  { name: 'Microsoft', domain: 'microsoft.com', industry: 'Technology', sizeRange: '5000+', city: 'Redmond', state: 'WA', country: 'USA' },
  { name: 'Amazon', domain: 'amazon.com', industry: 'Technology', sizeRange: '5000+', city: 'Seattle', state: 'WA', country: 'USA' },
  { name: 'Tesla', domain: 'tesla.com', industry: 'Automotive', sizeRange: '5000+', city: 'Palo Alto', state: 'CA', country: 'USA' },
  { name: 'Netflix', domain: 'netflix.com', industry: 'Technology', sizeRange: '1001-5000', city: 'Los Gatos', state: 'CA', country: 'USA' },
  { name: 'Adobe', domain: 'adobe.com', industry: 'Technology', sizeRange: '1001-5000', city: 'San Jose', state: 'CA', country: 'USA' },
  { name: 'Intel', domain: 'intel.com', industry: 'Technology', sizeRange: '5000+', city: 'Santa Clara', state: 'CA', country: 'USA' },
  { name: 'Nvidia', domain: 'nvidia.com', industry: 'Technology', sizeRange: '1001-5000', city: 'Santa Clara', state: 'CA', country: 'USA' },
  { name: 'Salesforce', domain: 'salesforce.com', industry: 'Technology', sizeRange: '1001-5000', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Uber', domain: 'uber.com', industry: 'Technology', sizeRange: '1001-5000', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Airbnb', domain: 'airbnb.com', industry: 'Technology', sizeRange: '501-1000', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Stripe', domain: 'stripe.com', industry: 'Financial Technology', sizeRange: '501-1000', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Figma', domain: 'figma.com', industry: 'Technology', sizeRange: '201-500', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Notion', domain: 'notion.so', industry: 'Technology', sizeRange: '201-500', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Canva', domain: 'canva.com', industry: 'Technology', sizeRange: '501-1000', city: 'Sydney', state: 'NSW', country: 'Australia' },
  
  // Healthcare/Biotech Companies
  { name: 'Moderna', domain: 'modernatx.com', industry: 'Biotech', sizeRange: '1001-5000', city: 'Cambridge', state: 'MA', country: 'USA' },
  { name: 'Regeneron', domain: 'regeneron.com', industry: 'Biotech', sizeRange: '1001-5000', city: 'Tarrytown', state: 'NY', country: 'USA' },
  { name: 'Vertex Pharmaceuticals', domain: 'vrtx.com', industry: 'Biotech', sizeRange: '1001-5000', city: 'Boston', state: 'MA', country: 'USA' },
  { name: 'Genentech', domain: 'gene.com', industry: 'Biotech', sizeRange: '1001-5000', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Amgen', domain: 'amgen.com', industry: 'Biotech', sizeRange: '5000+', city: 'Thousand Oaks', state: 'CA', country: 'USA' },
  { name: 'Gilead Sciences', domain: 'gilead.com', industry: 'Biotech', sizeRange: '1001-5000', city: 'Foster City', state: 'CA', country: 'USA' },
  { name: 'Biogen', domain: 'biogen.com', industry: 'Biotech', sizeRange: '1001-5000', city: 'Cambridge', state: 'MA', country: 'USA' },
  { name: 'Illumina', domain: 'illumina.com', industry: 'Biotech', sizeRange: '1001-5000', city: 'San Diego', state: 'CA', country: 'USA' },
  { name: 'Invitae', domain: 'invitae.com', industry: 'Biotech', sizeRange: '501-1000', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Tempus AI', domain: 'tempus.com', industry: 'Healthcare Tech', sizeRange: '201-500', city: 'Chicago', state: 'IL', country: 'USA' },
  
  // Additional Tech Companies
  { name: 'IBM', domain: 'ibm.com', industry: 'Technology', sizeRange: '5000+', city: 'Armonk', state: 'NY', country: 'USA' },
  { name: 'Oracle', domain: 'oracle.com', industry: 'Technology', sizeRange: '5000+', city: 'Austin', state: 'TX', country: 'USA' },
  { name: 'Cisco', domain: 'cisco.com', industry: 'Technology', sizeRange: '5000+', city: 'San Jose', state: 'CA', country: 'USA' },
  { name: 'VMware', domain: 'vmware.com', industry: 'Technology', sizeRange: '1001-5000', city: 'Palo Alto', state: 'CA', country: 'USA' },
  { name: 'Slack', domain: 'slack.com', industry: 'Technology', sizeRange: '501-1000', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Zoom', domain: 'zoom.us', industry: 'Technology', sizeRange: '501-1000', city: 'San Jose', state: 'CA', country: 'USA' },
  { name: 'Dropbox', domain: 'dropbox.com', industry: 'Technology', sizeRange: '501-1000', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Box', domain: 'box.com', industry: 'Technology', sizeRange: '501-1000', city: 'Redwood City', state: 'CA', country: 'USA' },
  { name: 'Twilio', domain: 'twilio.com', industry: 'Technology', sizeRange: '501-1000', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Datadog', domain: 'datadoghq.com', industry: 'Technology', sizeRange: '501-1000', city: 'New York', state: 'NY', country: 'USA' },
  { name: 'HashiCorp', domain: 'hashicorp.com', industry: 'Technology', sizeRange: '201-500', city: 'San Francisco', state: 'CA', country: 'USA' },
  { name: 'Elastic', domain: 'elastic.co', industry: 'Technology', sizeRange: '501-1000', city: 'Mountain View', state: 'CA', country: 'USA' },
  { name: 'MongoDB', domain: 'mongodb.com', industry: 'Technology', sizeRange: '501-1000', city: 'New York', state: 'NY', country: 'USA' },
  { name: 'Confluent', domain: 'confluent.io', industry: 'Technology', sizeRange: '201-500', city: 'Mountain View', state: 'CA', country: 'USA' },
  { name: 'Databricks', domain: 'databricks.com', industry: 'Technology', sizeRange: '201-500', city: 'San Francisco', state: 'CA', country: 'USA' },
];

// Culture score templates for different company types
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
  console.log('Starting company data seed...');
  
  for (const company of companiesData) {
    // Insert company
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
    
    // Insert culture scores from multiple sources
    const sources = ['glassdoor', 'indeed', 'comparably'];
    for (const source of sources) {
      const scores = getCultureScores(company.industry);
      const today = new Date().toISOString().split('T')[0];
      
      await connection.execute(
        `INSERT INTO cultureScores 
         (companyId, source, overallRating, workLifeBalance, compensationBenefits, careerOpportunities, 
          cultureValues, seniorManagement, ceoApproval, recommendToFriend, reviewCount, dateCollected)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          companyId,
          source,
          scores.overallRating.toFixed(2),
          scores.workLifeBalance.toFixed(2),
          scores.compensationBenefits.toFixed(2),
          scores.careerOpportunities.toFixed(2),
          scores.cultureValues.toFixed(2),
          scores.seniorManagement.toFixed(2),
          scores.ceoApproval.toFixed(2),
          scores.recommendToFriend.toFixed(2),
          scores.reviewCount,
          today,
        ]
      );
    }
    
    // Insert some trend data (last 6 months)
    for (let i = 0; i < 6; i++) {
      const monthDate = new Date();
      monthDate.setMonth(monthDate.getMonth() - i);
      const monthYear = monthDate.toISOString().split('T')[0];
      
      const metrics = ['overallRating', 'workLifeBalance', 'compensationBenefits'];
      for (const metric of metrics) {
        const trendValue = (3.5 + Math.random() * 1.5).toFixed(2);
        await connection.execute(
          `INSERT INTO cultureTrends (companyId, metricName, metricValue, monthYear, source)
           VALUES (?, ?, ?, ?, ?)`,
          [companyId, metric, trendValue, monthYear, 'glassdoor']
        );
      }
    }
    
    // Insert some layoff events for variety
    if (Math.random() > 0.7) {
      const layoffDate = new Date();
      layoffDate.setMonth(layoffDate.getMonth() - Math.floor(Math.random() * 12));
      const layoffDateStr = layoffDate.toISOString().split('T')[0];
      
      await connection.execute(
        `INSERT INTO layoffEvents (companyId, date, employeesAffected, percentageOfWorkforce, notes)
         VALUES (?, ?, ?, ?, ?)`,
        [
          companyId,
          layoffDateStr,
          Math.floor(Math.random() * 500) + 50,
          (Math.random() * 15).toFixed(2),
          'Restructuring',
        ]
      );
    }
    
    console.log(`✓ Seeded ${company.name}`);
  }
  
  console.log('✓ Company data seed completed successfully!');
  await connection.end();
} catch (error) {
  console.error('Error seeding data:', error);
  await connection.end();
  process.exit(1);
}
