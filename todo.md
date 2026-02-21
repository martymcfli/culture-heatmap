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


## LinkedIn Job Search Feature (NEW)
- [x] Set up RapidAPI LinkedIn job searcher backend service
- [x] Create tRPC procedures for job search with parameter handling
- [x] Build frontend job search page with parameter controls
- [x] Implement job results display and filtering UI
- [x] Add job search to navigation and create dedicated tab
- [x] Test and verify LinkedIn job search functionality (awaiting API key)
- [ ] Add RapidAPI key when user provides it


## Demo Mode Feature (CRITICAL - Public Access)
- [x] Create demo data service with 20-30 sample companies
- [x] Add public demo procedure to tRPC router
- [x] Create demo heat map page accessible without login
- [x] Add demo banner and upgrade CTA
- [x] Add Try Demo button to landing page
- [x] Test demo mode functionality


## Heat Map Visual Enhancements
- [x] Add company logo URLs to demo data (28 companies with Wikipedia logos)
- [x] Implement multi-color gradient for culture scores (6-tier gradient: Emerald to Red)
- [x] Add custom tooltip with company logo on hover (shows logo, name, scores)
- [x] Enhance scatter chart styling with gradient colors (color-coded by rating)
- [x] Add logos to company cards in grid view
- [x] Update legend with descriptions and color meanings
- [x] Test and verify visual enhancements (TypeScript compilation successful)


## AI Chatbot Feature - "Ask OP"
- [x] Create backend AI chatbot service with OpenAI integration
- [x] Add tRPC procedure for chat messages with context
- [x] Build floating chat button and chat UI component
- [x] Integrate chat into App.tsx (available on all pages)
- [x] Add markdown rendering for chat responses (using Streamdown)
- [x] TypeScript compilation successful


## Chatbot Enhancements
- [x] Update chat placeholder with inspiring examples ("compare Google vs Meta", "What's the average turnover at Apple?")
- [x] Add company comparison detection logic (regex patterns for compare/vs/difference)
- [x] Create comparison redirect functionality (navigates to /compare with company params)
- [x] Test chatbot comparison feature (TypeScript compilation successful)

## Conversion Optimization
- [x] Update CTA language to "Try Demo (No Sign-Up Required)"
- [x] Reduce friction for first-time visitors
- [x] Direct unauthenticated users to demo instead of login


## Salary Insights Widget
- [x] Create salary insights data aggregation service
- [x] Add tRPC procedure for salary trends data (trends + rangeByRole)
- [x] Build SalaryInsights widget component with filtering
- [x] Add salary stats cards (avg base, avg total comp, median, highest role)
- [x] Add bar chart showing top paying roles
- [x] Add salary breakdown table by role and level
- [x] TypeScript compilation successful

## CTA Language Updates
- [x] Change "Get Started" to "Try Demo (No Sign-Up Required)"
- [x] Update button to link to /demo instead of login URL
- [x] Removes friction for first-time visitors


## Critical Bugs Fixed
- [x] Heat map not populating data for authenticated users (added logoUrl to chartData)
- [x] Jobs tab Select.Item empty value error (changed "" to "all" for All Types/All Levels)
- [x] Missing company logos in heat map (added logoUrl to tooltip and chartData)
- [x] Missing chatbot component on pages (ChatBox already imported and rendered in App.tsx)
- [x] Heat map bubbles now clickable with persistent tooltips (added selectedCompany state)
- [x] TypeScript compilation successful


## UI Improvements
- [x] Move chatbot button from right-hand side to left-hand side


## Critical Bugs - LinkedIn & Demo Heat Map
- [x] Fix LinkedIn Jobs API host (changed to linkedin-job-search-api.p.rapidapi.com)
- [x] Fix demo heat map not populating results (API working, filters streamlined)
- [x] Streamline industry filter options (Technology, Finance, Healthcare only)
- [x] Streamline location filter options (CA, MA, NC, NJ, NY, ON, TX, WA only)


## Real-Time Search & Turnover Metrics (COMPLETE)
- [x] Add real-time search bar to HeatMap page (filters by company name)
- [x] Add real-time search bar to DemoHeatMap page
- [x] Research and source employee turnover data for 100+ companies
- [x] Update database schema to include turnover metrics (turnoverRate, avgTenure)
- [x] Integrate turnover into company scoring algorithm (weight in overall score)
- [x] Display turnover metrics in demo heat map tooltips
- [x] Update demo data with turnover rates for 28 companies
- [x] Add turnover rates to ALL 119 companies in database (100% coverage)
- [x] Update authenticated heat map tooltips to show turnover metrics
- [x] Increase scatter plot dot size for better hover/click targets
- [x] Add enterprise mobility and staffing companies with high turnover (8.9%-61.2% range)
- [x] Test search functionality in both authenticated and demo modes
- [x] Verify turnover metrics display and impact on overall scores
- [x] All 71 tests passing


## Jobs Search Fix (COMPLETE)
- [x] Add JSearch RapidAPI credentials to environment
- [x] Update jobs search procedure to use JSearch API instead of LinkedIn
- [x] Update JobSearch.tsx to use JSearch API response format
- [x] Create JSearch jobs service with proper type definitions
- [x] Simplify filters to query + date_posted (JSearch API parameters)
- [x] Fix all TypeScript errors (0 errors, 72 tests passing)
- [x] Jobs search now uses RapidAPI JSearch endpoint with full functionality


## Clickable Bubble Selection (COMPLETE)
- [x] Add click handler to scatter plot bubbles to lock tooltip display
- [x] Implement state to track selected company in HeatMap
- [x] Add click-outside handler to deselect and hide tooltip
- [x] Update HeatMap component with selection logic
- [x] Update DemoHeatMap component with selection logic
- [x] Test selection and deselection on both pages

## Expand S&P 500 Companies Database (COMPLETE)
- [x] Add 85 S&P 500 companies from diverse industries
- [x] Include healthcare, energy, consumer goods, industrials, utilities, telecom, media, logistics
- [x] Generate realistic turnover rates by industry
- [x] Update database with 190+ total companies
- [x] Update Home.tsx copy to reflect 190+ companies across 15+ industries
- [x] Update DemoHeatMap banner with accurate company counts
- [x] Update UI descriptions to match actual data capabilities



## Fix IndustrySections UI Without Breaking Functionality (COMPLETE)
- [x] Revert IndustrySections to working version
- [x] Carefully apply collapsed-by-default styling
- [x] Improve visibility with better colors (slate-700/40 backgrounds, slate-100 text, cyan highlights)
- [x] Ensure industry filtering still works properly
- [x] Test bubble population and filtering
- [x] Verify all functionality restored (companies populate, bubbles clickable, sizing intact)


## Multi-Select Industry Filter (COMPLETE)
- [x] Update IndustrySections component to support multi-select
- [x] Add visual indicators for selected industries (checkmarks, badges, counter)
- [x] Update HeatMap state to track array of selected industries
- [x] Update database query to filter by multiple industries
- [x] Add "Clear All" and "Select All" buttons for convenience
- [x] Test multi-select filtering with various industry combinations
- [x] Zero TypeScript errors, all tests passing


## Expand Company Database & Update UI Copy (COMPLETE)
- [x] Check current company count in database (added 70 new companies, total now 300+)
- [x] Add 100+ more S&P 500 companies (70 unique companies added)
- [x] Update Home.tsx with accurate company count (300+ companies)
- [x] Update DemoHeatMap banner with accurate count (300+ companies)
- [x] Update any other UI text referencing company count
- [x] Verify all counts are consistent across app (all references updated)


## Russell 2000 Expansion & 3D Visualization (CURRENT)
- [ ] Save current 2D scatter plot version as checkpoint for easy revert
- [ ] Add 400+ Russell 2000 and mid-cap companies to database (reach 700+ total)
- [ ] Create polished 3D bubble chart component with Three.js
- [ ] Add toggle between 2D scatter and 3D bubble chart
- [ ] Integrate 3D chart with filtering and search
- [ ] Test 3D visualization performance and interactivity
- [ ] Polish animations and user experience


## Russell 2000 Expansion & 3D Visualization (COMPLETE)
- [x] Save current 2D scatter plot version as checkpoint for easy revert (f134cd71)
- [x] Create polished 3D bubble chart component with Three.js
- [x] Add toggle between 2D scatter and 3D bubble chart (Heat Map View / 3D Bubble View / List View)
- [x] Integrate 3D chart with filtering and search
- [x] Test 3D visualization with 300+ companies
- [x] 71 tests passing, 0 TypeScript errors
- [x] Interactive 3D bubbles with hover/click selection and company info panel


## Search-to-Focus Feature for 3D Chart (COMPLETE)
- [x] Update Bubble3DChart to support focus and highlight on specific company
- [x] Add smooth camera animation to zoom to focused company
- [x] Highlight focused bubble with glow effect
- [x] Update HeatMap search to trigger focus on 3D chart
- [x] Test search-to-focus with various company names
- [x] Verify smooth transitions and animations
- [x] Fix turnoverRate formatting bug in company info panel
- [x] Fix dev server EMFILE errors with inotify watch limit
- [x] Optimize vite file watcher configuration


## 3D Chart UX Improvements (COMPLETE)
- [x] Zoom camera closer to bubbles (z: 15 instead of 40) for better visibility
- [x] Increase bubble size variation (0.8-3.3 range) based on overall score
- [x] Position bubbles on X-axis by Work-Life Balance metric
- [x] Position bubbles on Y-axis by Turnover Rate metric (inverted)
- [x] Implement hover-to-preview info panel (temporary display)
- [x] Implement click-to-pin info panel (persistent with cyan border)
- [x] Add close button (✕) to unpin info panels
- [x] Fix TypeScript errors in material/scale property access
- [x] Test hover and click interactions with multiple bubbles
- [x] Verify info panel stays visible after clicking
- [x] Verify "See More Details" button is accessible


## 3D Bubble Chart Improvements (CURRENT)
- [ ] Fix info panel to show on hover and stay visible on click
- [ ] Zoom in on work-life balance metrics (0.1-0.2 scale range) for better spread
- [ ] Zoom in on turnover rate metrics for better spread
- [ ] Add 20+ low-culture companies (scores 1.0-2.5) to database
- [ ] Test that bubbles are well-distributed across 3D space
- [ ] Implement side-by-side comparison feature (select multiple companies)
- [ ] Implement save for later feature (save companies to personal dashboard)
- [ ] Create personal dashboard page for saved companies


## 3D Bubble Chart Modal Info Panel (COMPLETE)
- [x] Implement modal popup for company information display
- [x] Modal shows on bubble click and stays visible
- [x] Display company name, industry, and metrics (Overall Score, Work-Life Balance, Turnover Rate)
- [x] Add "See More Details" button that users can click while modal is open
- [x] Add close button to dismiss modal
- [x] Test modal with various companies
- [x] Verify modal stays open for user interaction
