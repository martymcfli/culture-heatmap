import mysql from 'mysql2/promise';

const connection = await mysql.createConnection(process.env.DATABASE_URL);

// Import the news service functions
import('../server/news-service.ts').then(async (newsService) => {
  try {
    console.log('Fetching companies from database...');
    
    // Get all companies
    const [companies] = await connection.execute('SELECT id, name, industry FROM companies LIMIT 20');
    
    console.log(`Found ${companies.length} companies. Generating AI news...`);
    
    // Generate news for each company
    for (const company of companies) {
      try {
        const newsItem = await newsService.generateCompanyNews(
          company.name,
          company.industry,
          company.id
        );
        
        if (newsItem) {
          // Insert into database
          await connection.execute(
            `INSERT INTO companyNews (companyId, industryCategory, headline, summary, sourceName, sentiment, relevanceScore, publishedDate)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [
              newsItem.companyId,
              newsItem.industryCategory,
              newsItem.headline,
              newsItem.summary,
              newsItem.sourceName,
              newsItem.sentiment,
              newsItem.relevanceScore,
              newsItem.publishedDate,
            ]
          );
          
          console.log(`✓ Generated news for ${company.name}`);
        }
      } catch (error) {
        console.error(`Failed to generate news for ${company.name}:`, error.message);
      }
    }
    
    // Get unique industries
    const [industries] = await connection.execute(
      'SELECT DISTINCT industry FROM companies WHERE industry IS NOT NULL LIMIT 10'
    );
    
    console.log(`\nGenerating industry news for ${industries.length} industries...`);
    
    // Generate industry news
    for (const { industry } of industries) {
      try {
        const newsItem = await newsService.generateIndustryNews(industry);
        
        if (newsItem) {
          // Insert into database
          await connection.execute(
            `INSERT INTO companyNews (industryCategory, headline, summary, sourceName, sentiment, relevanceScore, publishedDate)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              newsItem.industryCategory,
              newsItem.headline,
              newsItem.summary,
              newsItem.sourceName,
              newsItem.sentiment,
              newsItem.relevanceScore,
              newsItem.publishedDate,
            ]
          );
          
          console.log(`✓ Generated industry news for ${industry}`);
        }
      } catch (error) {
        console.error(`Failed to generate news for ${industry}:`, error.message);
      }
    }
    
    console.log('\nNews seeding complete!');
    await connection.end();
  } catch (error) {
    console.error('Error seeding news:', error);
    process.exit(1);
  }
}).catch((error) => {
  console.error('Failed to import news service:', error);
  process.exit(1);
});
