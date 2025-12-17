# Secret Santa Prototype

A web application for organizing and managing Secret Santa gift exchanges with friends, family, or coworkers.

## What is this?

Secret Santa Prototype is a digital solution for coordinating Secret Santa events. It allows organizers to create gift exchange events, and automatically assign gift recipients while maintaining secrecy. The app handles all the logistics of pairing people together and ensures no one gets assigned to themselves.

## Features

- **Event Creation**: Set up new Secret Santa events with customizable details
- **Participant Management**: Easily invite and manage participants
- **Automated Assignment**: Randomly assigns Secret Santa pairings
- **Secure & Private**: Built with Supabase for secure data storage
- **Modern UI**: Clean, responsive interface built with shadcn/ui components
- **Real-time Updates**: Powered by React Query for seamless data synchronization

## How to Use

### For Organizers

1. **Create an Event**: Start a new Secret Santa event and configure the details
2. **Invite Participants**: Tell them to join using the deployment link
3. **Assign Pairings**: Once all participants have joined, trigger the automatic assignment
4. **Monitor Progress**: Track who has viewed their assignment and participation status

### For Participants

1. **Join an Event**: Register using your name and PIN
2. **View Your Assignment**: See who you're buying a gift for (kept secret from others)

## Tech Stack

This project is built with modern web technologies:

- **Vite** - Fast build tool and development server
- **TypeScript** - Type-safe JavaScript
- **React** - UI framework
- **React Router** - Client-side routing
- **Supabase** - Backend as a service (authentication & database)
- **shadcn/ui** - High-quality React components
- **Tailwind CSS** - Utility-first CSS framework
- **React Hook Form + Zod** - Form handling and validation
- **TanStack Query** - Data fetching and caching
- **Lucide React** - Icon library

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or bun package manager

### Installation

```sh
# Clone the repository
git clone https://github.com/victorvalchez/secret-santa-prototype.git

# Navigate to the project directory
cd secret-santa-prototype

# Install dependencies
npm install
# or if using bun
bun install

# Set up environment variables
# Copy .env file and add your Supabase credentials
cp .env.example .env

# Start the development server
npm run dev
```

### Environment Setup

Create a `.env` file in the root directory with your Supabase credentials:

```env
VITE_SUPABASE_URL=your-supabase-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Available Scripts

- `npm run dev` - Start development server with hot reload
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run lint` - Run ESLint for code quality
- `npm run preview` - Preview production build locally

## Development

The application follows a standard React + Vite structure:

```
src/
├── components/     # Reusable UI components
├── pages/         # Route components
├── hooks/         # Custom React hooks
├── lib/           # Utility functions and configurations
└── types/         # TypeScript type definitions
```

## Deployment

The application can be deployed to any static hosting service that supports single-page applications:

- Vercel
- Netlify
- GitHub Pages
- Cloudflare Pages

Make sure to configure environment variables in your hosting platform's settings.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This is a prototype project. Please check with the repository owner for licensing information.

---

Built with ❤️ for easier holiday gift exchanges
