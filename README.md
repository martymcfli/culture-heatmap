# 🔥 Culture Heat Map

> **Discover Your Ideal Workplace** — Interactive platform to explore and compare company cultures across 100+ leading organizations. Powered by real employee reviews, salary data, and AI-driven insights.

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20Now-blue?style=for-the-badge&logo=globe)](https://3000-i960klxvjb846kmb97bkn-664d7eb9.us2.manus.computer)
[![GitHub](https://img.shields.io/badge/GitHub-View%20Code-black?style=for-the-badge&logo=github)](https://github.com/martymcfli/culture-heatmap)
[![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)](LICENSE)

---

## ✨ Features

### 🎯 Core Features
- **Interactive Heat Map** — Visualize company cultures with color-coded scatter plots (Overall Rating vs Work-Life Balance)
- **28+ Sample Companies** — Explore demo data without signing in (Google, Microsoft, Apple, Amazon, Meta, Netflix, Stripe, and more)
- **Advanced Filtering** — Filter by industry, location, company size, and culture scores
- **Company Profiles** — Deep-dive into individual company metrics, reviews, and job openings
- **Salary Benchmarking** — Compare compensation across 1,664+ salary entries by role and seniority level

### 🚀 Premium Features (Sign In Required)
- **100+ Companies** — Full access to comprehensive company database
- **AI-Powered Recommendations** — Get personalized company suggestions based on your priorities using OpenAI
- **Smart Comparisons** — Side-by-side company analysis with radar charts and detailed metrics
- **LinkedIn Job Search** — Search 10,000+ jobs with customizable filters (title, location, seniority, remote)
- **Favorites & Saved Comparisons** — Bookmark companies and save comparison snapshots
- **Anonymous Reviews** — Submit and read real employee feedback
- **Trend Analysis** — Track how company cultures evolve over time

### 📊 Data Integration
- **Glassdoor Data** — Real employee ratings and reviews
- **Indeed Reviews** — Additional employee feedback and insights
- **Comparably Ratings** — Compensation and culture benchmarks
- **LinkedIn Jobs API** — Live job postings with detailed requirements
- **News Integration** — Company news and announcements

---

## 🛠️ Tech Stack

### Frontend
- **React 19** — Modern UI library with hooks and concurrent features
- **TypeScript** — Type-safe JavaScript for reliability
- **Tailwind CSS 4** — Utility-first styling with OKLCH colors
- **Recharts** — Interactive data visualization (scatter charts, radar charts)
- **shadcn/ui** — High-quality, accessible component library
- **Wouter** — Lightweight client-side routing
- **Vite** — Lightning-fast build tool and dev server

### Backend
- **Express.js 4** — Lightweight Node.js web framework
- **tRPC 11** — End-to-end type-safe APIs (no REST, no GraphQL)
- **Drizzle ORM** — Type-safe SQL query builder
- **MySQL/TiDB** — Relational database for company and user data
- **Zod** — Runtime type validation for API inputs

### Infrastructure & Services
- **Manus OAuth** — Secure authentication and user management
- **S3 Storage** — File uploads and asset management
- **OpenAI API** — AI-powered recommendations and insights
- **RapidAPI LinkedIn Jobs** — Job search integration
- **Glassdoor API** — Company culture data
- **NewsAPI** — Company news and announcements
- **Finnhub API** — Financial data and company metrics

### Testing & Quality
- **Vitest** — Fast unit testing framework
- **TypeScript Compiler** — Static type checking
- **ESLint** — Code linting (configured in template)

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ and pnpm
- MySQL or TiDB database
- Environment variables (see below)

### Installation

```bash
# Clone the repository
git clone https://github.com/martymcfli/culture-heatmap.git
cd culture-heatmap

# Install dependencies
pnpm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your API keys and database URL

# Run database migrations
pnpm db:push

# Start the development server
pnpm dev
```

The app will be available at `http://localhost:3000`

### Environment Variables

```env
# Database
DATABASE_URL=mysql://user:password@localhost:3306/culture_heatmap

# Authentication
JWT_SECRET=your-secret-key-here
VITE_APP_ID=your-manus-app-id
OAUTH_SERVER_URL=https://api.manus.im
VITE_OAUTH_PORTAL_URL=https://manus.im/login

# APIs
OPENAI_API_KEY=sk-proj-...
RAPIDAPI_LINKEDIN_JOBS_KEY=your-rapidapi-key
GLASSDOOR_API_KEY=your-glassdoor-key
NEWSAPI_KEY=your-newsapi-key
FINNHUB_API_KEY=your-finnhub-key
GEMINI_API_KEY=your-gemini-key

# Storage
VITE_FRONTEND_FORGE_API_KEY=your-forge-key
VITE_FRONTEND_FORGE_API_URL=https://api.manus.im
```

---

## 📁 Project Structure

```
culture-heatmap/
├── client/                          # React frontend
│   ├── src/
│   │   ├── pages/                   # Page components
│   │   │   ├── Home.tsx             # Landing page
│   │   │   ├── DemoHeatMap.tsx      # Public demo (no login required)
│   │   │   ├── HeatMap.tsx          # Full heat map (authenticated)
│   │   │   ├── CompanyProfile.tsx   # Company details
│   │   │   ├── Comparison.tsx       # Side-by-side comparison
│   │   │   ├── SalaryBenchmark.tsx  # Salary data
│   │   │   ├── JobSearch.tsx        # LinkedIn job search
│   │   │   └── ...
│   │   ├── components/              # Reusable UI components
│   │   ├── lib/                     # Utilities (tRPC client, etc.)
│   │   ├── App.tsx                  # Route definitions
│   │   └── main.tsx                 # Entry point
│   └── index.html
├── server/                          # Express backend
│   ├── routers.ts                   # tRPC procedure definitions
│   ├── db.ts                        # Database query helpers
│   ├── demo-data.ts                 # Sample companies for demo
│   ├── linkedin-jobs-service.ts     # Job search integration
│   ├── recommendation-service.ts    # AI recommendations
│   ├── comparison-helpers.ts        # Comparison data logic
│   └── _core/                       # Framework internals
├── drizzle/                         # Database schema & migrations
│   └── schema.ts                    # Table definitions
├── shared/                          # Shared types and constants
└── package.json
```

---

## 🔌 API Integration

### OpenAI Integration
Used for AI-powered company recommendations:
```typescript
const recommendations = await invokeLLM({
  messages: [
    { role: "system", content: "You are a career advisor..." },
    { role: "user", content: "Find companies similar to Google..." }
  ]
});
```

### LinkedIn Jobs API
Search jobs with customizable parameters:
```typescript
const jobs = await searchLinkedInJobs({
  title_filter: "Software Engineer",
  location_filter: "United States",
  type_filter: "FULL_TIME",
  remote: true,
  limit: 20
});
```

### Glassdoor Integration
Fetch company culture data and reviews:
```typescript
const companyData = await fetchGlassdoorData(companyName);
```

---

## 🧪 Testing

Run the test suite:
```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Run specific test file
pnpm test server/comparison.test.ts
```

Current test coverage: **62/64 tests passing**
- ✅ API validation tests
- ✅ Comparison and recommendation tests
- ✅ LinkedIn jobs integration tests
- ✅ Authentication tests

---

## 🎨 Design System

### Color Palette
- **Primary**: Cyan (#06b6d4), Blue (#3b82f6)
- **Accent**: Purple (#a855f7), Pink (#ec4899)
- **Success**: Green (#10b981)
- **Warning**: Amber (#f59e0b)
- **Danger**: Red (#ef4444)
- **Background**: Slate-950 (#030712)

### Typography
- **Headlines**: Inter, 600-700 weight
- **Body**: Inter, 400-500 weight
- **Monospace**: Fira Code for code blocks

### Components
- Shadcn/ui components with Tailwind customization
- Dark theme optimized for readability
- Glassmorphism effects for depth
- Smooth animations and transitions

---

## 🚢 Deployment

### Deploy to Manus (Recommended)
```bash
# Create a checkpoint
git add .
git commit -m "Ready for deployment"

# Push to GitHub
git push user_github main

# Click "Publish" in Manus Management UI
```

The app will be deployed with:
- ✅ Custom domain support
- ✅ Automatic SSL/TLS
- ✅ Database included
- ✅ Environment variables managed
- ✅ Zero-downtime deployments

### Deploy to Other Platforms
This is a full-stack app (React + Express + Database), so it requires:
- **Frontend**: Vercel, Netlify (with serverless backend)
- **Backend**: Railway, Render, Fly.io
- **Database**: Managed MySQL/PostgreSQL

---

## 📊 Database Schema

### Companies Table
```sql
CREATE TABLE companies (
  id INT PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  industry VARCHAR(100),
  headquartersCity VARCHAR(100),
  headquartersState VARCHAR(50),
  sizeRange VARCHAR(50),
  founded_year INT,
  website VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Aggregate Scores Table
```sql
CREATE TABLE aggregateScores (
  id INT PRIMARY KEY,
  companyId INT NOT NULL,
  overallRating DECIMAL(3,2),
  workLifeBalance DECIMAL(3,2),
  compensationBenefits DECIMAL(3,2),
  careerOpportunities DECIMAL(3,2),
  cultureValues DECIMAL(3,2),
  seniorManagement DECIMAL(3,2),
  FOREIGN KEY (companyId) REFERENCES companies(id)
);
```

### Users Table
```sql
CREATE TABLE users (
  id INT PRIMARY KEY,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255),
  role ENUM('user', 'admin') DEFAULT 'user',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

See `drizzle/schema.ts` for complete schema definition.

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📝 License

This project is licensed under the MIT License — see the [LICENSE](LICENSE) file for details.

---

## 🙋 Support

### Issues & Bugs
Found a bug? [Open an issue](https://github.com/martymcfli/culture-heatmap/issues)

### Feature Requests
Have an idea? [Start a discussion](https://github.com/martymcfli/culture-heatmap/discussions)

### Questions?
Check the [Wiki](https://github.com/martymcfli/culture-heatmap/wiki) or [Discussions](https://github.com/martymcfli/culture-heatmap/discussions)

---

## 🙏 Acknowledgments

- **Data Sources**: Glassdoor, Indeed, Comparably, LinkedIn
- **UI Framework**: shadcn/ui and Tailwind CSS
- **Visualization**: Recharts
- **Backend**: tRPC and Drizzle ORM
- **Hosting**: Manus

---

## 📈 Roadmap

### Q1 2026
- [ ] Advanced filtering with multiple criteria
- [ ] Export heat map as image/PDF
- [ ] Email notifications for new reviews
- [ ] Interview questions library

### Q2 2026
- [ ] Mobile app (React Native)
- [ ] Slack integration for job alerts
- [ ] Custom company dashboards
- [ ] Analytics for HR teams

### Q3 2026
- [ ] Predictive culture matching (ML)
- [ ] Glassdoor/Indeed review aggregation
- [ ] Salary negotiation guides
- [ ] Career path recommendations

---

## 📞 Contact

**Built by**: Marty McFli  
**GitHub**: [@martymcfli](https://github.com/martymcfli)  
**Live Demo**: [culture-heatmap.manus.space](https://3000-i960klxvjb846kmb97bkn-664d7eb9.us2.manus.computer)

---

<div align="center">

**[⬆ back to top](#-culture-heat-map)**

Made with ❤️ using React, TypeScript, and Tailwind CSS

</div>
