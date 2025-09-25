# Adaptive Timetabling Optimizer (ATO)

An intelligent timetabling system for educational institutions built with Next.js, React, and TypeScript.

## Features

- **Resource Management**: Manage classrooms, faculty, laboratories, and subjects
- **Constraint Management**: Define time slots, preferences, and scheduling constraints
- **Timetable Generation**: Generate optimized timetables using advanced algorithms
- **Workflow Management**: Approval workflows with role-based access control
- **Analytics & Reports**: Comprehensive reporting and analytics dashboard
- **Multi-role Support**: Admin, Faculty, Coordinator, and Viewer roles

## Tech Stack

- **Frontend**: Next.js 14, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Radix UI components
- **Authentication**: Custom JWT-based authentication
- **State Management**: React hooks and context
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18.0.0 or higher
- npm 8.0.0 or higher

### Installation

1. Clone the repository:
\`\`\`bash
git clone <repository-url>
cd adaptive-timetabling-optimizer
\`\`\`

2. Install dependencies:
\`\`\`bash
npm install
\`\`\`

3. Run the development server:
\`\`\`bash
npm run dev
\`\`\`

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

### Demo Credentials

For testing purposes, you can use these demo accounts:

- **Admin**: admin@university.edu / password
- **Faculty**: faculty@university.edu / password
- **Coordinator**: coordinator@university.edu / password

## Project Structure

\`\`\`
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard pages
│   └── login/            # Authentication pages
├── components/            # React components
│   ├── auth/             # Authentication components
│   ├── constraints/      # Constraint management
│   ├── layout/           # Layout components
│   ├── resources/        # Resource management
│   ├── timetables/       # Timetable components
│   ├── ui/               # UI components (shadcn/ui)
│   └── workflow/         # Workflow components
├── lib/                  # Utility libraries
└── public/               # Static assets
\`\`\`

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run format` - Format code with Prettier

### Adding New Features

1. **Components**: Add new components in the appropriate directory under `components/`
2. **Pages**: Add new pages in the `app/` directory following Next.js App Router conventions
3. **API Routes**: Add API endpoints in `app/api/`
4. **Types**: Define TypeScript interfaces in component files or create shared types in `lib/`

## Backend Integration

This project is currently set up with mock data and demo authentication. To integrate with a real backend:

### Database Integration

1. **Choose a Database**: PostgreSQL, MySQL, or MongoDB
2. **ORM/Query Builder**: Prisma, Drizzle, or direct SQL
3. **Replace Mock Data**: Update components to fetch from API endpoints
4. **Environment Variables**: Add database connection strings

### Authentication

1. **Replace Mock Auth**: Integrate with your authentication provider
2. **Session Management**: Implement proper session/token management
3. **Role-Based Access**: Ensure proper authorization checks

### API Endpoints

Replace the current mock API routes with real implementations:

- `/api/auth/*` - Authentication endpoints
- `/api/resources/*` - Resource management
- `/api/timetables/*` - Timetable operations
- `/api/constraints/*` - Constraint management

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:

- Netlify
- Railway
- DigitalOcean App Platform
- AWS Amplify

## Environment Variables

Create a `.env.local` file in the root directory:

\`\`\`env
# Database (when integrating with real backend)
DATABASE_URL="your-database-url"

# Authentication (when using external auth)
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# Other integrations
# Add your API keys and configuration here
\`\`\`

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/new-feature`
3. Commit your changes: `git commit -am 'Add new feature'`
4. Push to the branch: `git push origin feature/new-feature`
5. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:

1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

## Roadmap

- [ ] Real-time collaboration features
- [ ] Advanced optimization algorithms
- [ ] Mobile application
- [ ] Integration with popular LMS platforms
- [ ] Advanced analytics and reporting
- [ ] Multi-language support
