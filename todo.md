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
