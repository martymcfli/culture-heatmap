# 🌍 Company Culture Heat Map

A comprehensive platform for discovering and comparing workplace environments across 100+ leading tech companies. Make informed career decisions by exploring aggregated culture ratings, salary benchmarks, real interview experiences, and community reviews.

**🚀 [Visit the Live Site](https://3000-i960klxvjb846kmb97bkn-664d7eb9.us2.manus.computer/)**

---

## ✨ Features

### 📊 Interactive Heat Map Visualization
- Scatter chart visualization showing work-life balance vs. overall company ratings
- Color-coded culture scores for quick insights
- Clickable company bubbles for detailed profiles
- Advanced filtering by location, industry, company size, and culture scores

### 🏢 100+ Company Database
- Comprehensive coverage across tech, finance, healthcare, e-commerce, media, gaming, automotive, energy, and manufacturing sectors
- Real-time data from Glassdoor Real-Time API via RapidAPI
- Aggregated ratings from multiple sources (Glassdoor, Indeed, Comparably)
- 1,664+ salary data entries for benchmarking

### 💼 Detailed Company Profiles
- Aggregate culture scores across 6 dimensions:
  - Overall Rating
  - Work-Life Balance
  - Compensation
  - Career Development
  - Company Culture
  - Management Quality
- Radar charts for visual score comparison
- 6-month trend analysis
- Layoff event tracking
- Real interview experiences from Glassdoor
- Active job openings with direct links
- AI-powered company news and industry insights

### 💰 Salary Benchmarking
- Compare salaries across 8 job roles:
  - Software Engineer
  - Product Manager
  - Data Scientist
  - DevOps Engineer
  - UX Designer
  - Business Analyst
  - Sales Engineer
  - Marketing Manager
- 4 experience levels: Entry, Mid, Senior, Lead
- Statistical analysis: min, max, median, 25th/75th percentiles
- Interactive bar charts and compensation breakdowns

### 👥 Community Features
- **Anonymous Reviews**: Submit multi-dimensional ratings without tracking
- **Review Voting**: Mark reviews as helpful or flag inappropriate content
- **Favorites**: Save companies for later comparison
- **Saved Comparisons**: Store side-by-side company analyses
- **Search with Autocomplete**: Find companies instantly with recent search history

### 🔐 User Account System
- Secure authentication via Manus OAuth
- Persistent favorites and saved comparisons
- User profile management

### 🎨 Modern Dark Theme
- Network visualization background with animated nodes
- Glassmorphism effects with gradient accents
- Smooth page transitions using Framer Motion
- Responsive design for all devices

---

## 🛠️ Tech Stack

### Frontend
- **React 19** with TypeScript
- **Tailwind CSS 4** for styling
- **Shadcn/ui** for component library
- **Recharts** for interactive visualizations
- **Framer Motion** for animations
- **Wouter** for client-side routing

### Backend
- **Express.js** for API server
- **tRPC** for type-safe API procedures
- **Drizzle ORM** for database management
- **PostgreSQL** for data persistence

### External APIs
- **Glassdoor Real-Time API** (via RapidAPI) for interview data and job openings
- **OpenAI API** for AI-powered news generation

### Testing & Quality
- **Vitest** for unit and integration testing
- 48+ passing tests covering all major features
- Full TypeScript type safety

---

## 🚀 Getting Started

### Prerequisites
- Node.js 22+
- pnpm package manager
- PostgreSQL database

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/martymcfli/culture-heatmap.git
   cd culture-heatmap
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   ```

3. **Set up environment variables**
   Create a `.env` file with the following:
   ```env
   DATABASE_URL=your_postgresql_connection_string
   JWT_SECRET=your_jwt_secret
   VITE_APP_ID=your_manus_app_id
   OAUTH_SERVER_URL=your_oauth_server_url
   VITE_OAUTH_PORTAL_URL=your_oauth_portal_url
   GLASSDOOR_API_KEY=your_rapidapi_key
   GLASSDOOR_API_HOST=glassdoor-real-time.p.rapidapi.com
   OPENAI_API_KEY=your_openai_api_key
   ```

4. **Set up the database**
   ```bash
   pnpm db:push
   ```

5. **Start the development server**
   ```bash
   pnpm dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

---

## 📁 Project Structure

```
culture-heatmap/
├── client/
│   ├── src/
│   │   ├── pages/           # Page components (Home, HeatMap, Browse, etc.)
│   │   ├── components/      # Reusable UI components
│   │   ├── contexts/        # React contexts
│   │   ├── hooks/           # Custom hooks
│   │   ├── lib/             # Utilities and tRPC client
│   │   ├── App.tsx          # Main app with routing
│   │   └── index.css        # Global styles
│   └── public/              # Static assets
├── server/
│   ├── routers.ts           # tRPC procedure definitions
│   ├── db.ts                # Database query helpers
│   ├── services/            # External API integrations
│   │   ├── glassdoor.ts     # Glassdoor API client
│   │   └── openai.ts        # OpenAI API client
│   └── *.test.ts            # Vitest test files
├── drizzle/
│   └── schema.ts            # Database schema
└── package.json
```

---

## 🧪 Testing

Run the test suite:
```bash
pnpm test
```

Run tests in watch mode:
```bash
pnpm test:watch
```

---

## 📊 Database Schema

### Core Tables
- **companies**: Company information and metadata
- **culture_scores**: Aggregate culture ratings (6 dimensions)
- **culture_trends**: Historical culture score trends
- **layoff_events**: Layoff tracking and dates
- **company_reviews**: Anonymous community reviews
- **salary_data**: Salary benchmarking data (1,664+ entries)
- **interview_data**: Real interview experiences from Glassdoor
- **users**: User accounts and authentication
- **user_favorites**: Saved favorite companies
- **user_comparisons**: Saved company comparisons

---

## 🔌 API Integration

### Glassdoor Real-Time API
Fetches real interview experiences and job openings for companies. Integrated via RapidAPI with caching to optimize API calls.

### OpenAI API
Generates AI-powered company news and industry insights based on company profiles and recent trends.

---

## 🎯 Key Pages

| Page | Purpose |
|------|---------|
| **Home** | Landing page with feature highlights and featured companies |
| **Heat Map** | Interactive scatter chart visualization with filtering |
| **Browse** | Company listing with advanced multi-dimensional filtering |
| **Company Profile** | Detailed company information, reviews, jobs, and trends |
| **Comparison** | Side-by-side analysis of multiple companies |
| **Salary Benchmark** | Salary comparison across roles and experience levels |
| **Favorites** | Saved companies for quick access |

---

## 🌟 Highlights

✅ **100+ Companies** across diverse industries  
✅ **Real Data** from Glassdoor, Indeed, and Comparably  
✅ **Anonymous Reviews** for honest community feedback  
✅ **AI-Powered Insights** with OpenAI integration  
✅ **Responsive Design** works on all devices  
✅ **Dark Modern Theme** with smooth animations  
✅ **Type-Safe API** with tRPC and TypeScript  
✅ **Comprehensive Testing** with 48+ passing tests  

---

## 📈 Data Sources

- **Glassdoor Real-Time API**: Interview experiences, job openings, company metrics
- **Aggregated Ratings**: Glassdoor, Indeed, Comparably
- **Salary Data**: Benchmarked across 104 companies, 8 roles, 4 levels
- **Community Reviews**: Anonymous user submissions

---

## 🚀 Deployment

The application is currently deployed on **Manus Hosting** with a live URL. To deploy your own instance:

1. Set up a PostgreSQL database
2. Configure environment variables
3. Deploy to your preferred platform (Manus, Railway, Render, etc.)
4. Update the database with initial company data

---

## 📝 License

This project is open source and available under the MIT License.

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit pull requests or open issues for bugs and feature requests.

---

## 📧 Contact

For questions or feedback, please reach out or open an issue on GitHub.

---

**Happy exploring! 🌟**
