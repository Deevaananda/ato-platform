# ATO Platform - Installation & Setup Guide

## Quick Setup Instructions

### Prerequisites
Ensure you have the following installed:
- Node.js 18.17+ ([Download here](https://nodejs.org))
- pnpm 8.0+ (`npm install -g pnpm`)
- Git ([Download here](https://git-scm.com))

### Installation Steps

#### 1. Clone or Download the Project
```bash
# If using Git
git clone <repository-url>
cd ato-platform

# Or download and extract the ZIP file
```

#### 2. Install Dependencies
```bash
pnpm install
```

#### 3. Start Development Server
```bash
pnpm dev
```

#### 4. Access the Application
- Open your browser
- Navigate to `http://localhost:3000`
- Use demo credentials to login

### Demo Login Credentials

**Administrator Account:**
- Email: `admin@example.com`
- Password: `admin123`
- Access: Full system control

**Faculty Account:**
- Email: `faculty@example.com`
- Password: `faculty123`
- Access: Department-specific features

### Project Structure

```
ato-platform/
├── app/                 # Next.js 14 App Router
│   ├── api/            # API endpoints
│   ├── dashboard/      # Dashboard pages
│   └── globals.css     # Global styles
├── components/         # React components
│   ├── auth/          # Authentication components
│   ├── constraints/   # Constraint management
│   ├── layout/        # Layout components
│   ├── reports/       # Report components
│   ├── resources/     # Resource management
│   ├── timetables/    # Timetable components
│   ├── ui/            # shadcn/ui components
│   └── workflow/      # Approval workflow
├── hooks/             # Custom React hooks
├── lib/               # Utilities and services
│   ├── database/      # Database utilities
│   ├── optimization/  # Genetic algorithm
│   ├── services/      # Business logic
│   ├── types/         # TypeScript definitions
│   └── utils/         # Helper functions
├── public/            # Static assets
└── styles/            # Stylesheets
```

## Development Guide

### Available Scripts

```bash
# Start development server
pnpm dev

# Build for production
pnpm build

# Start production server
pnpm start

# Run linting
pnpm lint

# Format code
pnpm format
```

### Key Technologies Used

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS v4, shadcn/ui components
- **State Management**: React hooks, Context API
- **Authentication**: JWT with NextAuth.js patterns
- **Optimization**: Custom genetic algorithm implementation
- **Deployment**: Vercel-ready configuration

### Environment Configuration

Create `.env.local` file for environment variables:

```env
# Database (when ready)
DATABASE_URL="your-database-url"

# Authentication
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Optional: API Configuration
API_BASE_URL="http://localhost:3000/api"
```

## Database Setup (Future Enhancement)

The project is structured for easy database integration:

### Recommended Database Options
- **PostgreSQL**: Best for production
- **MySQL**: Alternative relational database
- **SQLite**: For development/testing
- **Prisma**: ORM for database management

### Database Schema Overview
The application expects these main entities:
- Users (admin, faculty, coordinators)
- Departments
- Courses
- Instructors
- Rooms/Classrooms
- Timetables
- Constraints

## Deployment Options

### 1. Vercel (Recommended)
1. Push code to GitHub
2. Connect repository to Vercel
3. Deploy automatically

### 2. Netlify
1. Build the project: `pnpm build`
2. Deploy the `out` folder to Netlify

### 3. Self-hosted
1. Build: `pnpm build`
2. Start: `pnpm start`
3. Configure reverse proxy (Nginx/Apache)

## Customization Guide

### Adding New Features

#### 1. Create API Endpoint
```typescript
// app/api/your-feature/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  return NextResponse.json({ message: 'Success' });
}
```

#### 2. Create Component
```tsx
// components/your-feature/your-component.tsx
import { Card } from '@/components/ui/card';

export function YourComponent() {
  return <Card>Your feature content</Card>;
}
```

#### 3. Add Route
```tsx
// app/dashboard/your-feature/page.tsx
import { YourComponent } from '@/components/your-feature/your-component';

export default function YourFeaturePage() {
  return <YourComponent />;
}
```

### Modifying Genetic Algorithm

The optimization engine is located in:
- `lib/optimization/genetic-algorithm.ts`
- `lib/optimization/fitness-functions.ts`

Key parameters to adjust:
- Population size
- Mutation rate
- Crossover rate
- Selection method
- Fitness function weights

### Styling Customization

The project uses Tailwind CSS v4:
- Global styles: `app/globals.css`
- Component styles: Utility classes
- Dark/light theme: Built-in theme provider

## Performance Optimization

### Built-in Optimizations
- Next.js App Router with streaming
- Component lazy loading
- Image optimization
- Automatic code splitting

### Monitoring
- Performance metrics in browser dev tools
- Network request analysis
- Bundle size analysis with `@next/bundle-analyzer`

## Security Considerations

### Current Security Features
- JWT token authentication
- CORS configuration
- Input validation
- XSS protection
- CSRF protection (Next.js built-in)

### Recommended Enhancements
- Rate limiting
- Input sanitization
- SQL injection protection (when database added)
- Role-based access control enhancement
- Audit logging

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
# Change port
pnpm dev -- --port 3001
```

**Dependencies issues:**
```bash
# Clear cache and reinstall
rm -rf node_modules pnpm-lock.yaml
pnpm install
```

**Build failures:**
```bash
# Check TypeScript errors
pnpm type-check

# Check for missing dependencies
pnpm install --frozen-lockfile
```

### Performance Issues

**Slow development server:**
- Reduce the number of imported components
- Use dynamic imports for heavy components
- Clear browser cache

**Large bundle size:**
- Analyze bundle: `pnpm build && pnpm analyze`
- Remove unused dependencies
- Optimize images and assets

## Support & Maintenance

### Regular Maintenance Tasks
- Update dependencies monthly
- Monitor security vulnerabilities
- Check performance metrics
- Review error logs
- Update documentation

### Getting Help
- Check GitHub issues
- Review Next.js documentation
- Consult component library docs (shadcn/ui)
- Community forums and Discord

### Contributing
1. Fork the repository
2. Create feature branch
3. Make changes with tests
4. Submit pull request
5. Follow code review process

---

**Version**: 1.0
**Last Updated**: September 26, 2025
**Next.js Version**: 14.2.0
**Node.js Requirement**: 18.17.0+

For technical support, consult the development team or create an issue in the project repository.