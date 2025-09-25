# 🎓 ATO Platform - Automatic Timetable Organization System

[![Next.js](https://img.shields.io/badge/Next.js-14.0-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3.0-38bdf8?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-ORM-2D3748?style=flat-square&logo=prisma)](https://prisma.io/)

A comprehensive **university timetable management system** built with modern web technologies. ATO Platform uses advanced genetic algorithms to automatically generate optimized timetables while handling complex constraints and resource management.

## ✨ Key Features

### 🧬 **Intelligent Timetable Generation**
- **Genetic Algorithm Optimization**: Advanced AI-powered scheduling
- **Multi-objective Optimization**: Balances conflicts, utilization, and workload
- **Real-time Progress Tracking**: Live generation updates with metrics
- **Multiple Solutions**: Provides ranked optimization options
- **Conflict Detection**: Comprehensive constraint violation analysis

### 🏫 **Complete Resource Management**
- **Classroom Management**: Room capacity, type, and facilities tracking
- **Faculty Management**: Instructor profiles with department assignments
- **Subject Management**: Course credits, prerequisites, and scheduling
- **Department Management**: Multi-department support with hierarchies

### 🔐 **Advanced Authentication & Access Control**
- **Role-based Access**: Admin, Faculty, and Coordinator roles
- **Secure Sessions**: JWT-based authentication system
- **Protected Routes**: Middleware-based route protection

### 📊 **Analytics & Reporting**
- **Performance Dashboard**: Real-time metrics and KPIs
- **Infeasibility Analysis**: Detailed conflict reports and suggestions
- **Utilization Reports**: Room and faculty efficiency tracking
- **Constraint Monitoring**: Violation detection and resolution

### 🎯 **NEP 2020 Compliance**
- **Multidisciplinary Support**: Cross-department course scheduling
- **Flexible Curricula**: Elective and core course management
- **Choice-based Credit System**: CBCS compliant structure

## 🛠️ Technology Stack

- **Frontend**: Next.js 14 with App Router, React 18, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Database**: Prisma ORM with SQLite (easily configurable)
- **Authentication**: Custom JWT implementation
- **Algorithms**: Custom genetic algorithm for optimization
- **State Management**: React hooks and context
- **UI/UX**: Responsive design with dark/light theme support

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/ato-platform.git
cd ato-platform

# Install dependencies
npm install
# or
pnpm install

# Run development server
npm run dev
# or 
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

For testing purposes, you can use these demo accounts:

**Admin Access:**
- Email: `admin@example.com`
- Password: `admin123`

**Faculty Access:**  
- Email: `faculty@example.com`
- Password: `faculty123`

## 📖 Usage Guide

### 1. **Resource Setup**
- Navigate to **Resources** tab
- Add departments, classrooms, and faculty
- Configure room capacities and facilities

### 2. **Subject Configuration**
- Go to **Subjects** section  
- Add courses with credits and prerequisites
- Assign to appropriate departments

### 3. **Timetable Generation**
- Visit **Timetables** tab
- Configure generation parameters:
  - Select department and semester
  - Set batch size and optimization goals
  - Adjust algorithm settings (iterations, time limits)
- Click **"Generate Timetable Options"**
- Review and select from optimized solutions

### 4. **Analysis & Reports**
- Access **Reports** for performance analytics
- Use **Infeasibility Analyzer** for conflict detection
- Monitor resource utilization and faculty workload

## 🏗️ Architecture Overview

```
ATO Platform Architecture
├── Frontend (Next.js)
│   ├── Pages & Components
│   ├── Authentication Middleware  
│   └── UI/UX Layer
├── Backend APIs
│   ├── Resource Management
│   ├── Authentication Service
│   └── Optimization Engine
├── Database Layer
│   ├── Prisma ORM
│   ├── Resource Models
│   └── Constraint Storage
└── Optimization Engine
    ├── Genetic Algorithm
    ├── Constraint Solver
    └── Performance Analytics
```

## 🔧 Configuration

### Database Setup
The platform uses Prisma with SQLite by default. To use PostgreSQL or MySQL:

1. Update `DATABASE_URL` in `.env`
2. Modify `schema.prisma` provider
3. Run `npx prisma migrate dev`

### Environment Variables
Create a `.env.local` file:

```env
# Database
DATABASE_URL="file:./dev.db"

# Authentication  
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: External integrations
# EMAIL_SERVER_HOST="smtp.example.com"
# EMAIL_SERVER_PORT="587"
```

## 🤝 Production Deployment

### Vercel (Recommended)
```bash
# Deploy to Vercel
npx vercel

# Set environment variables in Vercel dashboard
# Update database to production provider
```

### Docker
```bash
# Build Docker image
docker build -t ato-platform .

# Run container
docker run -p 3000:3000 ato-platform
```

## 📝 API Documentation

### Authentication Endpoints
- `POST /api/auth/login` - User authentication
- `POST /api/auth/logout` - Session termination  
- `GET /api/auth/me` - Current user info

### Resource Management
- `GET/POST /api/departments` - Department CRUD
- `GET/POST /api/courses` - Course management
- `GET/POST /api/instructors` - Faculty management
- `GET/POST /api/rooms` - Classroom management

### Analytics
- `GET /api/dashboard/stats` - System statistics
- `POST /api/optimization/generate` - Timetable generation

## 🧪 Testing

The platform includes comprehensive testing coverage:

- **Unit Tests**: Component and utility testing
- **Integration Tests**: API endpoint validation  
- **E2E Tests**: Complete user flow testing
- **Performance Tests**: Optimization algorithm benchmarks

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 🐛 Known Issues & Roadmap

### Current Limitations
- Single-tenant architecture (multi-tenant planned)
- Limited external calendar integration
- Basic reporting (advanced analytics in development)

### Upcoming Features
- 📱 Mobile application
- 🔗 LMS integrations (Moodle, Canvas)
- 📧 Email notifications
- 📊 Advanced analytics dashboard
- 🌐 Multi-language support

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup
1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Team

- **Lead Developer**: Advanced timetabling algorithms and system architecture
- **Algorithm Design**: Genetic algorithm optimization implementation
- **UI/UX Design**: Modern, accessible interface design

## 🙏 Acknowledgments

- **shadcn/ui** for beautiful React components
- **Next.js** team for the amazing framework
- **Prisma** for excellent database tooling
- **TailwindCSS** for utility-first styling
- **Lucide Icons** for consistent iconography

## 📞 Support

- 🐛 Issues: [GitHub Issues](https://github.com/yourusername/ato-platform/issues)
- 💬 Discussions: [GitHub Discussions](https://github.com/yourusername/ato-platform/discussions)

---

<p align="center">
  <strong>Built with ❤️ for educational institutions worldwide</strong>
</p>

<p align="center">
  <a href="#-ato-platform---automatic-timetable-organization-system">🔝 Back to top</a>
</p>