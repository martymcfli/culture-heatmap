-- Technology & Software
INSERT IGNORE INTO companies (name, industry, headquartersCity, headquartersState, turnoverRate, avgTenure, glassdoorRating, compensationRating, workLifeBalanceRating, cultureValuesRating, diversityInclusionRating) VALUES
('Apple', 'Technology', 'Cupertino', 'CA', 9.2, 5.8, 4.2, 4.3, 3.8, 4.1, 3.9),
('Microsoft', 'Technology', 'Redmond', 'WA', 8.5, 6.2, 4.3, 4.4, 3.9, 4.2, 4.0),
('Google', 'Technology', 'Mountain View', 'CA', 10.1, 5.5, 4.4, 4.5, 3.7, 4.3, 4.1),
('Amazon', 'Technology', 'Seattle', 'WA', 22.3, 3.2, 3.8, 3.9, 2.9, 3.6, 3.5),
('Meta', 'Technology', 'Menlo Park', 'CA', 14.7, 4.1, 4.0, 4.2, 3.3, 3.9, 3.8),
('Tesla', 'Automotive', 'Palo Alto', 'CA', 18.5, 3.8, 3.7, 3.8, 2.8, 3.5, 3.4),
('NVIDIA', 'Technology', 'Santa Clara', 'CA', 11.3, 5.2, 4.2, 4.3, 3.8, 4.1, 3.9),
('Intel', 'Technology', 'Santa Clara', 'CA', 12.8, 4.9, 4.0, 4.1, 3.6, 3.9, 3.8),
('Cisco', 'Technology', 'San Jose', 'CA', 13.2, 4.7, 4.1, 4.2, 3.7, 4.0, 3.9),
('Oracle', 'Technology', 'Austin', 'TX', 15.1, 4.3, 3.9, 4.0, 3.5, 3.8, 3.7),
('Adobe', 'Technology', 'San Jose', 'CA', 12.5, 5.0, 4.2, 4.3, 3.8, 4.1, 3.9),
('Salesforce', 'Technology', 'San Francisco', 'CA', 16.8, 3.9, 4.0, 4.1, 3.6, 3.9, 3.8),
('ServiceNow', 'Technology', 'Santa Clara', 'CA', 14.2, 4.5, 4.1, 4.2, 3.7, 4.0, 3.9),
('Workday', 'Technology', 'Pleasanton', 'CA', 13.9, 4.6, 4.1, 4.2, 3.7, 4.0, 3.9),
('Zoom', 'Technology', 'San Jose', 'CA', 17.3, 3.7, 3.9, 4.0, 3.4, 3.8, 3.7),

-- Healthcare & Pharmaceuticals
('Johnson & Johnson', 'Healthcare', 'New Brunswick', 'NJ', 10.5, 5.9, 4.2, 4.3, 3.8, 4.1, 3.9),
('Pfizer', 'Pharmaceuticals', 'New York', 'NY', 11.2, 5.6, 4.1, 4.2, 3.7, 4.0, 3.9),
('Moderna', 'Pharmaceuticals', 'Cambridge', 'MA', 19.8, 3.4, 3.8, 3.9, 3.1, 3.6, 3.5),
('Eli Lilly', 'Pharmaceuticals', 'Indianapolis', 'IN', 9.8, 6.1, 4.2, 4.3, 3.8, 4.1, 3.9),
('Merck', 'Pharmaceuticals', 'Kenilworth', 'NJ', 10.3, 5.8, 4.2, 4.3, 3.8, 4.1, 3.9),
('AbbVie', 'Pharmaceuticals', 'North Chicago', 'IL', 11.7, 5.4, 4.1, 4.2, 3.7, 4.0, 3.9),
('Bristol Myers Squibb', 'Pharmaceuticals', 'New York', 'NY', 12.1, 5.2, 4.0, 4.1, 3.6, 3.9, 3.8),
('Thermo Fisher Scientific', 'Healthcare', 'Waltham', 'MA', 13.5, 4.8, 4.0, 4.1, 3.6, 3.9, 3.8),
('UnitedHealth Group', 'Healthcare', 'Minnetonka', 'MN', 14.2, 4.6, 3.9, 4.0, 3.5, 3.8, 3.7),
('Humana', 'Healthcare', 'Louisville', 'KY', 15.8, 4.2, 3.8, 3.9, 3.4, 3.7, 3.6),
('Cigna', 'Healthcare', 'Bloomfield', 'CT', 16.3, 4.0, 3.8, 3.9, 3.4, 3.7, 3.6),
('Anthem', 'Healthcare', 'Indianapolis', 'IN', 17.1, 3.8, 3.7, 3.8, 3.3, 3.6, 3.5),

-- Financial Services
('JPMorgan Chase', 'Finance', 'New York', 'NY', 12.4, 5.3, 4.0, 4.1, 3.6, 3.9, 3.8),
('Bank of America', 'Finance', 'Charlotte', 'NC', 13.7, 4.9, 3.9, 4.0, 3.5, 3.8, 3.7),
('Wells Fargo', 'Finance', 'San Francisco', 'CA', 18.9, 3.5, 3.6, 3.7, 3.2, 3.5, 3.4),
('Citigroup', 'Finance', 'New York', 'NY', 14.2, 4.7, 3.9, 4.0, 3.5, 3.8, 3.7),
('Goldman Sachs', 'Finance', 'New York', 'NY', 16.5, 4.1, 3.8, 3.9, 3.4, 3.7, 3.6),
('Morgan Stanley', 'Finance', 'New York', 'NY', 15.8, 4.3, 3.8, 3.9, 3.4, 3.7, 3.6),
('Berkshire Hathaway', 'Finance', 'Omaha', 'NE', 8.2, 6.5, 4.3, 4.4, 3.9, 4.2, 4.0),
('BlackRock', 'Finance', 'New York', 'NY', 13.1, 5.0, 4.1, 4.2, 3.7, 4.0, 3.9),
('Vanguard', 'Finance', 'Malvern', 'PA', 11.9, 5.4, 4.2, 4.3, 3.8, 4.1, 3.9),
('Charles Schwab', 'Finance', 'San Francisco', 'CA', 14.6, 4.5, 4.0, 4.1, 3.6, 3.9, 3.8),

-- Consumer Goods & Retail
('Walmart', 'Retail', 'Bentonville', 'AR', 35.2, 2.1, 3.4, 3.5, 2.8, 3.2, 3.1),
('Costco', 'Retail', 'Issaquah', 'WA', 16.1, 4.2, 4.1, 4.2, 3.7, 4.0, 3.9),
('Target', 'Retail', 'Minneapolis', 'MN', 32.7, 2.3, 3.5, 3.6, 2.9, 3.3, 3.2),
('Home Depot', 'Retail', 'Atlanta', 'GA', 29.3, 2.6, 3.6, 3.7, 3.0, 3.4, 3.3),
('Lowes', 'Retail', 'Mooresville', 'NC', 31.8, 2.4, 3.5, 3.6, 2.9, 3.3, 3.2),
('Nike', 'Consumer Goods', 'Beaverton', 'OR', 13.2, 5.1, 4.1, 4.2, 3.7, 4.0, 3.9),
('Coca-Cola', 'Consumer Goods', 'Atlanta', 'GA', 11.5, 5.7, 4.2, 4.3, 3.8, 4.1, 3.9),
('PepsiCo', 'Consumer Goods', 'Purchase', 'NY', 12.3, 5.4, 4.1, 4.2, 3.7, 4.0, 3.9),
('Procter & Gamble', 'Consumer Goods', 'Cincinnati', 'OH', 10.8, 5.8, 4.2, 4.3, 3.8, 4.1, 3.9),
('Colgate-Palmolive', 'Consumer Goods', 'New York', 'NY', 11.2, 5.6, 4.1, 4.2, 3.7, 4.0, 3.9),
('Estee Lauder', 'Consumer Goods', 'New York', 'NY', 14.7, 4.4, 4.0, 4.1, 3.6, 3.9, 3.8),

-- Energy & Utilities
('ExxonMobil', 'Energy', 'Spring', 'TX', 9.5, 6.0, 4.1, 4.2, 3.7, 4.0, 3.9),
('Chevron', 'Energy', 'San Ramon', 'CA', 10.2, 5.9, 4.2, 4.3, 3.8, 4.1, 3.9),
('ConocoPhillips', 'Energy', 'Houston', 'TX', 11.3, 5.5, 4.1, 4.2, 3.7, 4.0, 3.9),
('Duke Energy', 'Utilities', 'Charlotte', 'NC', 8.7, 6.3, 4.2, 4.3, 3.8, 4.1, 3.9),
('NextEra Energy', 'Utilities', 'Juno Beach', 'FL', 9.1, 6.1, 4.2, 4.3, 3.8, 4.1, 3.9),
('American Electric Power', 'Utilities', 'Columbus', 'OH', 8.9, 6.2, 4.2, 4.3, 3.8, 4.1, 3.9),
('Dominion Energy', 'Utilities', 'Richmond', 'VA', 9.3, 6.0, 4.2, 4.3, 3.8, 4.1, 3.9),

-- Industrials & Manufacturing
('General Electric', 'Industrials', 'Boston', 'MA', 13.8, 4.8, 4.0, 4.1, 3.6, 3.9, 3.8),
('Boeing', 'Aerospace', 'Chicago', 'IL', 12.5, 5.2, 4.1, 4.2, 3.7, 4.0, 3.9),
('Lockheed Martin', 'Aerospace', 'Bethesda', 'MD', 11.2, 5.6, 4.1, 4.2, 3.7, 4.0, 3.9),
('Raytheon Technologies', 'Aerospace', 'Waltham', 'MA', 12.1, 5.3, 4.1, 4.2, 3.7, 4.0, 3.9),
('Caterpillar', 'Industrials', 'Deerfield', 'IL', 13.5, 4.9, 4.0, 4.1, 3.6, 3.9, 3.8),
('Deere & Company', 'Industrials', 'Moline', 'IL', 12.8, 5.1, 4.1, 4.2, 3.7, 4.0, 3.9),
('Emerson Electric', 'Industrials', 'St. Louis', 'MO', 12.3, 5.4, 4.1, 4.2, 3.7, 4.0, 3.9),
('3M', 'Industrials', 'St. Paul', 'MN', 13.1, 5.0, 4.0, 4.1, 3.6, 3.9, 3.8),
('Honeywell', 'Industrials', 'Charlotte', 'NC', 12.7, 5.2, 4.1, 4.2, 3.7, 4.0, 3.9),

-- Communication & Media
('Comcast', 'Telecom', 'Philadelphia', 'PA', 18.5, 3.8, 3.7, 3.8, 3.3, 3.6, 3.5),
('AT&T', 'Telecom', 'Dallas', 'TX', 16.2, 4.2, 3.8, 3.9, 3.4, 3.7, 3.6),
('Verizon', 'Telecom', 'New York', 'NY', 15.8, 4.3, 3.8, 3.9, 3.4, 3.7, 3.6),
('Charter Communications', 'Telecom', 'Stamford', 'CT', 19.3, 3.6, 3.7, 3.8, 3.3, 3.6, 3.5),
('Walt Disney', 'Media', 'Burbank', 'CA', 17.2, 4.0, 3.8, 3.9, 3.4, 3.7, 3.6),
('Netflix', 'Media', 'Los Gatos', 'CA', 15.9, 4.2, 3.9, 4.0, 3.5, 3.8, 3.7),
('Paramount Global', 'Media', 'New York', 'NY', 18.7, 3.7, 3.7, 3.8, 3.3, 3.6, 3.5),

-- Transportation & Logistics
('FedEx', 'Logistics', 'Memphis', 'TN', 24.5, 3.0, 3.5, 3.6, 2.8, 3.3, 3.2),
('UPS', 'Logistics', 'Atlanta', 'GA', 22.1, 3.3, 3.6, 3.7, 2.9, 3.4, 3.3),
('Delta Air Lines', 'Airlines', 'Atlanta', 'GA', 20.3, 3.5, 3.7, 3.8, 3.1, 3.5, 3.4),
('Southwest Airlines', 'Airlines', 'Dallas', 'TX', 19.8, 3.6, 3.8, 3.9, 3.2, 3.6, 3.5),
('Union Pacific', 'Transportation', 'Omaha', 'NE', 11.5, 5.7, 4.1, 4.2, 3.7, 4.0, 3.9),

-- Real Estate & Construction
('Prologis', 'Real Estate', 'San Francisco', 'CA', 14.2, 4.6, 4.0, 4.1, 3.6, 3.9, 3.8),
('American Tower', 'Real Estate', 'Boston', 'MA', 13.8, 4.8, 4.0, 4.1, 3.6, 3.9, 3.8),
('Crown Castle', 'Real Estate', 'Houston', 'TX', 13.5, 4.9, 4.0, 4.1, 3.6, 3.9, 3.8),

-- Food & Beverage
('McDonalds', 'Food & Beverage', 'Chicago', 'IL', 38.5, 1.9, 3.3, 3.4, 2.7, 3.1, 3.0),
('Starbucks', 'Food & Beverage', 'Seattle', 'WA', 42.1, 1.7, 3.2, 3.3, 2.6, 3.0, 2.9),
('Chipotle', 'Food & Beverage', 'Denver', 'CO', 39.8, 1.8, 3.3, 3.4, 2.7, 3.1, 3.0),
('Restaurant Brands', 'Food & Beverage', 'Toronto', 'ON', 36.2, 2.0, 3.4, 3.5, 2.8, 3.2, 3.1),
('Mondelez International', 'Food & Beverage', 'Chicago', 'IL', 13.5, 4.9, 4.0, 4.1, 3.6, 3.9, 3.8),
('General Mills', 'Food & Beverage', 'Minneapolis', 'MN', 12.1, 5.3, 4.1, 4.2, 3.7, 4.0, 3.9),
('Kraft Heinz', 'Food & Beverage', 'Chicago', 'IL', 14.3, 4.5, 4.0, 4.1, 3.6, 3.9, 3.8);
