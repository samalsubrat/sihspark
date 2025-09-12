# 🌊 SIH Spark - Water Quality Monitoring Dashboard

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![React](https://img.shields.io/badge/React-19.1.0-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.x-38B2AC)
![License](https://img.shields.io/badge/License-MIT-green)

**A modern, real-time water quality monitoring and disease prediction platform built for Smart India Hackathon**

[🚀 Live Demo](#) | [📖 Documentation](#) | [🐛 Report Bug](#) | [💡 Request Feature](#)

</div>

---

## 🌟 Overview

SIH Spark is an innovative water quality monitoring dashboard that combines real-time data analytics with predictive modeling to ensure safe water consumption. The platform provides comprehensive insights into water quality parameters, disease prediction capabilities, and alert systems for proactive health management.

### ✨ Key Features

- 🏠 **Comprehensive Dashboard** - Real-time KPI monitoring and data visualization
- 🔍 **Smart Search** - Advanced search capabilities for water body data
- 📊 **Analytics & Reports** - Detailed waterbody and medical test reports
- 🧪 **Testing Integration** - Medical and water quality test management
- 📈 **Predictive Analytics** - AI-powered disease prediction based on water quality
- ⚠️ **Alert System** - Real-time notifications for water quality issues
- 📱 **Responsive Design** - Mobile-first, modern UI/UX
- 🌙 **Dark Mode Support** - Seamless light/dark theme switching

## 🎯 Problem Statement

Water-borne diseases affect millions globally. Our solution addresses the critical need for:
- Real-time water quality monitoring
- Early disease outbreak prediction
- Data-driven health interventions
- Community awareness and alerts

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15.5.2 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS 4.x
- **UI Components**: Radix UI + Shadcn/ui
- **Icons**: Lucide React
- **Animations**: Framer Motion
- **Charts**: Recharts

### Backend & Database
- **Database**: Neon (PostgreSQL)
- **File Uploads**: UploadThing
- **Form Handling**: React Hook Form + Zod validation

### Development Tools
- **Linting**: ESLint
- **Package Manager**: PNPM
- **Version Control**: Git

## 🚀 Quick Start

### Prerequisites

Make sure you have the following installed:
- **Node.js** (v18.0.0 or higher)
- **PNPM** (recommended) or npm/yarn
- **Git**

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/samalsubrat/sihspark.git
   cd sihspark
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Fill in your environment variables:
   ```env
   DATABASE_URL=your_neon_database_url
   UPLOADTHING_SECRET=your_uploadthing_secret
   UPLOADTHING_APP_ID=your_uploadthing_app_id
   ```

4. **Run the development server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
sihspark/
├── 📁 public/                 # Static assets
├── 📁 src/
│   ├── 📁 app/               # Next.js App Router pages
│   │   ├── 📄 layout.tsx     # Root layout
│   │   ├── 📄 page.tsx       # Home page
│   │   └── 📁 dashboard/     # Dashboard pages
│   ├── 📁 components/        # Reusable components
│   │   ├── 📁 ui/           # Shadcn/ui components
│   │   ├── 📄 AppSidebar.tsx # Navigation sidebar
│   │   ├── 📄 charts.tsx     # Chart components
│   │   ├── 📄 kpi-row.tsx    # KPI cards
│   │   └── 📄 ...           # Other components
│   ├── 📁 hooks/            # Custom React hooks
│   └── 📁 lib/              # Utility functions
├── 📄 package.json          # Dependencies & scripts
├── 📄 tailwind.config.js    # Tailwind configuration
└── 📄 tsconfig.json         # TypeScript configuration
```

## 🎨 Design System

Our design system is built on:
- **Color Palette**: Modern, accessible colors with dark mode support
- **Typography**: Optimized for readability and hierarchy
- **Components**: Consistent, reusable UI components
- **Spacing**: 8px grid system for consistent layouts
- **Animations**: Subtle, purposeful micro-interactions

## 📊 Dashboard Features

### 🎯 KPI Monitoring
- Real-time water quality metrics
- Trend analysis and historical data
- Performance indicators with visual alerts

### 📈 Data Visualization
- Interactive charts and graphs
- Comparative analysis tools
- Exportable reports

### 🔔 Alert System
- Customizable threshold alerts
- Multi-channel notifications
- Priority-based alert routing

## 🧪 Testing & Quality

### Medical Tests Integration
- Test result management
- Historical tracking
- Correlation with water quality data

### Water Quality Testing
- Multiple parameter monitoring
- Automated analysis
- Compliance tracking

## 🚦 Available Scripts

```bash
# Development
pnpm dev          # Start development server
pnpm build        # Build for production
pnpm start        # Start production server
pnpm lint         # Run ESLint

# Database
pnpm db:push      # Push schema to database
pnpm db:studio    # Open database studio
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Smart India Hackathon** for the opportunity
- **Shadcn/ui** for the beautiful component library
- **Vercel** for hosting and deployment
- **Neon** for the database infrastructure

---

<div align="center">

**Built with ❤️ for SOA Ideathon 2025**

Made by [SPARK] | [Siksha O Anusandhan]

</div>
