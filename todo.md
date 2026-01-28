# Culture Heat Map - Project TODO

## Database & Schema
- [x] Design and implement database schema (companies, culture_scores, culture_trends, layoff_events, company_reviews)
- [x] Create migrations and push to database
- [x] Seed initial dataset with 50+ tech companies (San Antonio, NYC, healthcare/biotech)
- [x] Create database query helpers

## Backend API
- [x] Create tRPC procedures for fetching companies
- [x] Implement filtering logic (location, industry, size, scores, layoffs)
- [x] Add search and autocomplete procedures
- [ ] Build comparison data fetching
- [x] Create trend analysis procedures
- [ ] Implement similar companies recommendation logic
- [x] Add sorting and pagination support

## Frontend - Core Pages
- [x] Build Home/Dashboard page with hero section and featured companies
- [x] Create Heat Map visualization page with Recharts
- [x] Build Company Profile page with detailed metrics
- [x] Create Comparison page with radar charts and metric tables
- [x] Implement Search/Browse page with advanced filters

## Frontend - Components & Features
- [x] Build heat map visualization component with hover tooltips
- [x] Create filter sidebar component (location, industry, size, scores)
- [x] Implement search bar with autocomplete dropdown
- [x] Build company profile cards and detailed view
- [x] Create radar chart comparison component
- [x] Build trend charts for culture score history
- [x] Implement grid/list view toggle
- [x] Add layoff event display component
- [ ] Create similar companies recommendation section

## UI/UX & Styling
- [x] Set up color scheme (blue/green for positive, yellow/orange for neutral, red for negative)
- [x] Configure Tailwind CSS and shadcn/ui components
- [x] Implement responsive design (mobile-first)
- [x] Add loading states and error handling
- [x] Create empty states and placeholders
- [ ] Add micro-interactions and transitions

## Testing & Polish
- [x] Write vitest tests for backend procedures
- [x] Test filtering and search functionality
- [x] Verify responsive design on mobile/tablet/desktop
- [ ] Performance optimization (lazy loading, caching)
- [ ] Cross-browser testing
- [ ] Bug fixes and refinements

## Deployment
- [ ] Final checkpoint before publishing
- [ ] Deploy to production


## Anonymous Review Submission Feature
- [x] Create anonymousReviews table in database schema
- [x] Add tRPC procedure to submit anonymous reviews
- [x] Add tRPC procedure to fetch reviews for a company
- [x] Build review submission form component
- [x] Display recent reviews on company profile page
- [x] Add review filtering and sorting (by date, rating, helpfulness)
- [x] Implement review moderation flags (inappropriate content)
- [x] Add vitest tests for review procedures
- [x] Polish UI and add animations


## Bug Fixes & Data Integration
- [ ] Fix heat map loading issue on HeatMap page
- [ ] Add BioBridge Global to healthcare section
- [ ] Add Chime to tech section
- [ ] Integrate Reddit review data API
- [ ] Integrate Glassdoor review data API
- [ ] Populate culture_scores table with real data from Reddit/Glassdoor
- [ ] Test heat map visualization with populated data
- [ ] Verify all companies display correctly in filters


## Job Openings Integration
- [x] Create jobOpenings table in database schema
- [x] Integrate LinkedIn Jobs API or Indeed API
- [x] Create tRPC procedure to fetch job openings for a company
- [x] Build Job Openings component for company profile
- [x] Display job count and link to apply
- [x] Test job openings display

## AI News Integration
- [x] Create companyNews table in database schema
- [x] Integrate LLM to fetch and summarize recent news
- [x] Create tRPC procedure to fetch company/industry news
- [x] Build News component for company profile
- [x] Display news with publication date and source
- [x] Add news filtering by date range
- [x] Test news integration
- [x] OpenAI API key integration and validation

## User Account System & Favorites
- [x] Create userFavorites table in database schema
- [x] Create savedComparisons table in database schema
- [x] Add tRPC procedures for saving/removing favorites
- [x] Add tRPC procedures for saving/loading comparisons
- [x] Build user favorites page
- [x] Build saved comparisons page
- [x] Add favorite/save buttons to company profiles
- [x] Add favorite/save buttons to comparison view
- [x] Test user account features

## Industry Organization
- [x] Reorganize industries into sections (Tech, Finance, Healthcare, etc.)
- [x] Update filter UI to show industry sections
- [x] Update HeatMap page with industry sections
- [x] Update Home page with industry categories
- [x] Test industry filtering and display


## Dark Modern Theme & Design Update
- [x] Update global CSS with dark color palette
- [x] Configure Tailwind for dark mode
- [x] Add network visualization background to Home page
- [x] Create floating action buttons component
- [x] Add smooth animations and transitions
- [x] Update all pages with dark theme
- [x] Update card and component styling for dark mode
- [x] Add gradient overlays and glow effects
- [x] Test responsive design with new theme
- [x] Verify accessibility with dark theme


## Bug Fixes
- [x] Fix browse tab navigation not working
- [x] Fix heatmap tab navigation not working
- [x] Adjust background opacity for better content visibility


## Current Work - Phase 2
- [x] Fix browse tab routing (currently not navigating)
- [x] Apply dark theme to CompanyProfile page
- [x] Apply dark theme to Comparison page
- [x] Apply dark theme to Favorites page
- [x] Implement page transitions with Framer Motion
- [x] Add search bar with autocomplete suggestions
- [x] Add recent search history feature
- [x] Test all navigation and search functionality


## Salary Benchmarking Feature
- [x] Create salaryData table in database schema (role, level, baseSalary, bonus, equity, benefits)
- [x] Seed salary data for 100+ companies with multiple roles and levels (1,664 entries)
- [x] Create tRPC procedures for fetching salary data with filters
- [x] Build Salary Benchmarking page with role/level/company filters
- [x] Create salary comparison charts (bar, box plot, scatter)
- [x] Add salary data display to company profile pages
- [x] Implement salary range statistics (min, max, median, average, percentiles)
- [x] Add salary trend analysis over time
- [x] Create salary comparison export functionality
- [x] Write vitest tests for salary procedures (8 tests passing)

## Company Database Expansion
- [x] Add 60 additional companies across all sectors (54 new + 6 existing)
- [x] Update all references from 50+ to 100+ companies
- [x] Verify all company data is properly seeded (104 total companies)
- [x] Test filtering and search with expanded dataset


## Glassdoor Real-Time API Integration
- [x] Request and store Glassdoor API credentials (X-RapidAPI-Key)
- [x] Create Glassdoor API service for fetching interview details
- [x] Add interviewData table to store interview information
- [x] Create backend procedures for fetching Glassdoor interview data
- [x] Implement caching to reduce API calls
- [x] Update JobOpenings component with real Glassdoor data
- [x] Display interview questions and company insights
- [x] Add salary data from Glassdoor API
- [x] Test API integration and error handling
- [x] Verify data accuracy and freshness

## Bug Fixes - Heat Map Issue
- [x] Debug heat map page loading issue
- [x] Check browser console for errors
- [x] Verify API data fetching
- [x] Fix heat map visualization (removed empty SelectItem values)
- [x] Test heat map functionality

## Heat Map Visualization Issues (Current)
- [x] Fix getFilteredCompanies to include aggregate scores in results
- [x] Improve scatter chart styling and visibility
- [x] Add better data visualization (bubble size, colors)
- [x] Fix empty chart when filters are applied
- [x] Add company data labels to bubbles (via custom tooltip)
- [x] Improve responsive design for heat map
- [x] Add color legend showing score ratings
- [x] Add glow effects and hover animations
- [x] Improve chart height and spacing

## Comparison & Recommendation Features (NEW)
- [x] Build comparison data fetching (culture, salary, jobs, news)
- [x] Create comparison helpers for multiple companies
- [x] Implement AI-powered recommendations using OpenAI
- [x] Build similar companies recommendation logic
- [x] Integrate financial data support (Finnhub)
- [x] Create tRPC procedures for recommendations
- [x] Create tRPC procedures for comparison data
- [x] Write and pass 7 vitest tests for new features
- [ ] Create frontend UI for comparison page
- [ ] Create frontend UI for recommendations sidebar
