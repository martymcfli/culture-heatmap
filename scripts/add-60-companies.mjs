import mysql from "mysql2/promise";

const connection = await mysql.createConnection(process.env.DATABASE_URL);

const additionalCompanies = [
  // Finance & Banking (10)
  { name: "JPMorgan Chase", industry: "Finance", sizeRange: "5000+", city: "New York", state: "NY", country: "USA" },
  { name: "Goldman Sachs", industry: "Finance", sizeRange: "5000+", city: "New York", state: "NY", country: "USA" },
  { name: "Morgan Stanley", industry: "Finance", sizeRange: "5000+", city: "New York", state: "NY", country: "USA" },
  { name: "Bank of America", industry: "Finance", sizeRange: "5000+", city: "Charlotte", state: "NC", country: "USA" },
  { name: "Citigroup", industry: "Finance", sizeRange: "5000+", city: "New York", state: "NY", country: "USA" },
  { name: "Wells Fargo", industry: "Finance", sizeRange: "5000+", city: "San Francisco", state: "CA", country: "USA" },
  { name: "Stripe", industry: "Finance", sizeRange: "1001-5000", city: "San Francisco", state: "CA", country: "USA" },
  { name: "Square Inc", industry: "Finance", sizeRange: "1001-5000", city: "San Francisco", state: "CA", country: "USA" },
  { name: "Robinhood Markets", industry: "Finance", sizeRange: "501-1000", city: "Menlo Park", state: "CA", country: "USA" },
  { name: "Revolut Ltd", industry: "Finance", sizeRange: "501-1000", city: "London", state: "England", country: "UK" },

  // Healthcare & Biotech (10)
  { name: "Johnson & Johnson", industry: "Healthcare", sizeRange: "5000+", city: "New Brunswick", state: "NJ", country: "USA" },
  { name: "Pfizer Inc", industry: "Healthcare", sizeRange: "5000+", city: "New York", state: "NY", country: "USA" },
  { name: "Moderna Inc", industry: "Biotech", sizeRange: "1001-5000", city: "Cambridge", state: "MA", country: "USA" },
  { name: "Regeneron Pharmaceuticals", industry: "Biotech", sizeRange: "1001-5000", city: "Tarrytown", state: "NY", country: "USA" },
  { name: "Vertex Pharmaceuticals", industry: "Biotech", sizeRange: "1001-5000", city: "Boston", state: "MA", country: "USA" },
  { name: "Genentech Inc", industry: "Biotech", sizeRange: "1001-5000", city: "South San Francisco", state: "CA", country: "USA" },
  { name: "Gilead Sciences", industry: "Biotech", sizeRange: "1001-5000", city: "Foster City", state: "CA", country: "USA" },
  { name: "Amgen Inc", industry: "Biotech", sizeRange: "5000+", city: "Thousand Oaks", state: "CA", country: "USA" },
  { name: "Biogen Inc", industry: "Biotech", sizeRange: "1001-5000", city: "Cambridge", state: "MA", country: "USA" },
  { name: "Incyte Corporation", industry: "Biotech", sizeRange: "1001-5000", city: "Wilmington", state: "DE", country: "USA" },

  // E-commerce & Retail (10)
  { name: "Shopify Inc", industry: "E-commerce", sizeRange: "1001-5000", city: "Ottawa", state: "Ontario", country: "Canada" },
  { name: "Etsy Inc", industry: "E-commerce", sizeRange: "1001-5000", city: "New York", state: "NY", country: "USA" },
  { name: "Wayfair Inc", industry: "E-commerce", sizeRange: "1001-5000", city: "Boston", state: "MA", country: "USA" },
  { name: "Chewy Inc", industry: "E-commerce", sizeRange: "1001-5000", city: "Dania Beach", state: "FL", country: "USA" },
  { name: "Coursera Inc", industry: "Education", sizeRange: "501-1000", city: "Mountain View", state: "CA", country: "USA" },
  { name: "Udemy Inc", industry: "Education", sizeRange: "501-1000", city: "San Francisco", state: "CA", country: "USA" },
  { name: "Duolingo Inc", industry: "Education", sizeRange: "201-500", city: "Pittsburgh", state: "PA", country: "USA" },
  { name: "Peloton Interactive", industry: "Consumer", sizeRange: "1001-5000", city: "New York", state: "NY", country: "USA" },
  { name: "Allbirds Inc", industry: "Consumer", sizeRange: "201-500", city: "San Francisco", state: "CA", country: "USA" },
  { name: "Warby Parker Inc", industry: "Consumer", sizeRange: "501-1000", city: "New York", state: "NY", country: "USA" },

  // Media & Entertainment (10)
  { name: "Netflix Inc", industry: "Media", sizeRange: "1001-5000", city: "Los Gatos", state: "CA", country: "USA" },
  { name: "The Walt Disney Company", industry: "Media", sizeRange: "5000+", city: "Burbank", state: "CA", country: "USA" },
  { name: "Warner Bros Discovery", industry: "Media", sizeRange: "5000+", city: "New York", state: "NY", country: "USA" },
  { name: "Paramount Global", industry: "Media", sizeRange: "5000+", city: "New York", state: "NY", country: "USA" },
  { name: "Spotify Technology", industry: "Media", sizeRange: "1001-5000", city: "Stockholm", state: "Stockholm", country: "Sweden" },
  { name: "Roblox Corporation", industry: "Gaming", sizeRange: "501-1000", city: "San Mateo", state: "CA", country: "USA" },
  { name: "Epic Games Inc", industry: "Gaming", sizeRange: "501-1000", city: "Cary", state: "NC", country: "USA" },
  { name: "Riot Games Inc", industry: "Gaming", sizeRange: "501-1000", city: "Los Angeles", state: "CA", country: "USA" },
  { name: "Activision Blizzard", industry: "Gaming", sizeRange: "1001-5000", city: "Irvine", state: "CA", country: "USA" },
  { name: "Take-Two Interactive", industry: "Gaming", sizeRange: "501-1000", city: "New York", state: "NY", country: "USA" },

  // Automotive & Transportation (10)
  { name: "Tesla Inc", industry: "Automotive", sizeRange: "5000+", city: "Austin", state: "TX", country: "USA" },
  { name: "Ford Motor Company", industry: "Automotive", sizeRange: "5000+", city: "Dearborn", state: "MI", country: "USA" },
  { name: "General Motors", industry: "Automotive", sizeRange: "5000+", city: "Detroit", state: "MI", country: "USA" },
  { name: "BMW Group", industry: "Automotive", sizeRange: "5000+", city: "Munich", state: "Bavaria", country: "Germany" },
  { name: "Volkswagen Group", industry: "Automotive", sizeRange: "5000+", city: "Wolfsburg", state: "Lower Saxony", country: "Germany" },
  { name: "Uber Technologies", industry: "Transportation", sizeRange: "1001-5000", city: "San Francisco", state: "CA", country: "USA" },
  { name: "Lyft Inc", industry: "Transportation", sizeRange: "1001-5000", city: "San Francisco", state: "CA", country: "USA" },
  { name: "DoorDash Inc", industry: "Transportation", sizeRange: "1001-5000", city: "San Francisco", state: "CA", country: "USA" },
  { name: "Instacart Inc", industry: "Transportation", sizeRange: "1001-5000", city: "San Francisco", state: "CA", country: "USA" },
  { name: "Rivian Automotive", industry: "Automotive", sizeRange: "1001-5000", city: "Irvine", state: "CA", country: "USA" },

  // Energy & Utilities (5)
  { name: "NextEra Energy", industry: "Energy", sizeRange: "5000+", city: "Juno Beach", state: "FL", country: "USA" },
  { name: "Duke Energy Corporation", industry: "Energy", sizeRange: "5000+", city: "Charlotte", state: "NC", country: "USA" },
  { name: "Southern Company", industry: "Energy", sizeRange: "5000+", city: "Atlanta", state: "GA", country: "USA" },
  { name: "Brookfield Renewable", industry: "Energy", sizeRange: "1001-5000", city: "Toronto", state: "Ontario", country: "Canada" },
  { name: "First Solar Inc", industry: "Energy", sizeRange: "501-1000", city: "Tempe", state: "AZ", country: "USA" },

  // Manufacturing & Industrial (5)
  { name: "3M Company", industry: "Manufacturing", sizeRange: "5000+", city: "Saint Paul", state: "MN", country: "USA" },
  { name: "Caterpillar Inc", industry: "Manufacturing", sizeRange: "5000+", city: "Deerfield", state: "IL", country: "USA" },
  { name: "Lockheed Martin", industry: "Defense", sizeRange: "5000+", city: "Bethesda", state: "MD", country: "USA" },
  { name: "The Boeing Company", industry: "Aerospace", sizeRange: "5000+", city: "Arlington", state: "VA", country: "USA" },
  { name: "Raytheon Technologies", industry: "Defense", sizeRange: "5000+", city: "Waltham", state: "MA", country: "USA" },
];

try {
  let added = 0;
  let skipped = 0;

  for (const company of additionalCompanies) {
    try {
      // Check if company already exists
      const [existing] = await connection.execute(
        "SELECT id FROM companies WHERE name = ?",
        [company.name]
      );

      if (existing.length > 0) {
        console.log(`⊘ Skipped ${company.name} (already exists)`);
        skipped++;
        continue;
      }

      await connection.execute(
        "INSERT INTO companies (name, industry, sizeRange, headquartersCity, headquartersState, headquartersCountry) VALUES (?, ?, ?, ?, ?, ?)",
        [company.name, company.industry, company.sizeRange, company.city, company.state, company.country]
      );
      console.log(`✓ Added ${company.name}`);
      added++;
    } catch (error) {
      console.log(`✗ Error adding ${company.name}: ${error.message}`);
    }
  }

  console.log(`\n✅ Successfully added ${added} companies! (${skipped} already existed)`);
} catch (error) {
  console.error("Fatal error:", error);
} finally {
  await connection.end();
}
