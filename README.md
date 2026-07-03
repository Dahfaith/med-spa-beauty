# Med Spa & Beauty Arena

A premium, full-stack Next.js web application and administrative dashboard built for Med Spa & Beauty Arena.

## Overview
This platform serves as the digital storefront and management system for the spa and training academy. It includes dynamic routing, a beautifully responsive UI, and a secure backend powered by Supabase.

### Key Features
- **Dynamic Services & Pricing:** Managed directly from the admin dashboard.
- **Beauty Academy Portal:** Course listings (Beginner, Advanced, Masterclass).
- **Client Testimonials:** Dynamic 5-star reviews featured on the homepage.
- **Image Gallery:** Portfolio showcasing clinic procedures and academy training.
- **Secure Admin Dashboard:** Protected via Next.js Middleware and Supabase Authentication.
- **Contact & Bookings:** Direct integration with Supabase and WhatsApp routing.

## Technology Stack
- **Framework:** Next.js (App Router)
- **Styling:** Tailwind CSS
- **Backend/Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth (SSR)
- **Media Uploads:** Cloudinary (Admin Portal)

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Database Setup (Supabase)
To run this project locally or in production, you must link it to a Supabase project.

1. Execute the `database.sql` script in your Supabase SQL Editor.
2. Provide your API keys in the `.env.local` file:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your-url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloud-name
   ```
3. Set up an Admin user under the `Authentication` tab in Supabase to gain access to the `/admin` portal.

## Deployment
This project is optimized for deployment on Vercel. 
Simply push your repository to GitHub and connect it to your Vercel account. Ensure your Environment Variables are configured in the Vercel dashboard.
