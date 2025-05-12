# CMS Frontend

A modern, full-featured Content Management System (CMS) frontend built with Next.js, TypeScript, and Tailwind CSS. This project provides a dashboard for managing posts, categories, authors, media, and user profiles, with authentication and role-based access control.

## Features

- User authentication (login, signup, password reset)
- Dashboard for managing content
- Rich text editor for posts
- Media management
- User profile and settings
- Responsive and modern UI with Tailwind CSS
- API integration for backend communication

## Tech Stack

- [Next.js](https://nextjs.org/) (App Router)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Redux Toolkit](https://redux-toolkit.js.org/) (for state management)
- [Supabase](https://supabase.com/) (for authentication and backend API)

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone <repo-url>
   cd cms-frontend
   ```
2. Install dependencies:
   ```sh
   npm install
   # or
   yarn install
   ```
3. Copy the example environment variables and update them:
   ```sh
   cp .env.example .env.local
   # Edit .env.local with your API keys and endpoints
   ```

### Running the Development Server

```sh
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the app.

### Building for Production

```sh
npm run build
npm start
```

## Project Structure

- `src/app/` - Next.js app directory (pages, layouts, routes)
- `src/components/` - Reusable UI and feature components
- `src/api/` - API request utilities
- `src/store/` - Redux store and slices
- `src/types/` - TypeScript type definitions
- `src/context/` - React context providers
- `public/` - Static assets

## Environment Variables

Create a `.env.local` file in the root and set the following variables:

```
NEXT_PUBLIC_API_URL=<your-backend-api-url>
```

## Authentication

- Uses Supabase for authentication and session management.
- Middleware protects routes and handles redirects for authenticated/unauthenticated users.

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/your-feature`)
3. Commit your changes (`git commit -am 'Add new feature'`)
4. Push to the branch (`git push origin feature/your-feature`)
5. Open a pull request

## License

MIT

---

For questions or support, please open an issue or contact the maintainer.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [Project GitHub](https://github.com/mercyharbo/blog-cms-frontend) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.
