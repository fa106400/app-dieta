# Database Setup Guide

## Overview
This guide will help you set up the Supabase database for the Nutrition & Diet Management SaaS application.

## Prerequisites
- A Supabase account (free tier available)
- Basic knowledge of SQL and database management

## Step 1: Create Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click "New Project"
3. Choose your organization
4. Enter project details:
   - **Name**: `app-dieta` (or your preferred name)
   - **Database Password**: Generate a strong password
   - **Region**: Choose closest to your users
5. Click "Create new project"
6. Wait for project setup to complete (usually 2-3 minutes)

## Step 2: Get Project Credentials

1. In your project dashboard, go to **Settings** → **API**
2. Copy the following values:
   - **Project URL** (e.g., `https://your-project.supabase.co`)
   - **anon public** key
   - **service_role** key (keep this secret!)

## Step 3: Configure Environment Variables

1. Copy `env.example` to `.env.local`
2. Update the values with your Supabase credentials:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here
```

## Step 4: Run Database Schema

1. In your Supabase dashboard, go to **SQL Editor**
2. Copy the entire content of `database-schema.sql`
3. Paste it into the SQL editor
4. Click "Run" to execute the schema

## Step 5: Verify Setup

After running the schema, you should see:

### Tables Created:
- ✅ `profiles` - User profiles and preferences
- ✅ `subscriptions` - Subscription management
- ✅ `diets` - Diet catalog
- ✅ `diet_variants` - Caloric variations
- ✅ `meals` - Individual meal data
- ✅ `favorites` - User favorite diets
- ✅ `user_current_diet` - Active diet tracking
- ✅ `user_meal_log` - Meal completion logging
- ✅ `weights` - Weight tracking
- ✅ `badges` - Achievement system
- ✅ `user_badges` - User achievements
- ✅ `diet_recommendations` - AI recommendations
- ✅ `leaderboard_metrics` - Rankings
- ✅ `user_metrics` - User statistics

### Features Enabled:
- ✅ Row Level Security (RLS) policies
- ✅ Database indexes for performance
- ✅ Triggers for automatic timestamps
- ✅ Functions for metric calculations
- ✅ Sample data for testing
- ✅ Public views for diet browsing

## Step 6: Test Database Connection

1. Start your Next.js development server: `npm run dev`
2. Check the browser console for any Supabase connection errors
3. Verify that the database is accessible

## Step 7: Configure Authentication

1. In Supabase dashboard, go to **Authentication** → **Settings**
2. Configure your site URL (e.g., `http://localhost:3000`)
3. Set up email templates if needed
4. Configure any additional auth providers

## Database Schema Details

### Key Features:
- **User Isolation**: Each user can only access their own data
- **Public Catalog**: Diet information is publicly readable
- **Performance**: Optimized indexes for fast queries
- **Scalability**: Designed for free tier with room to grow

### Security:
- **Row Level Security**: Users can only access their own data
- **Input Validation**: Database constraints prevent invalid data
- **Permission Control**: Granular access control for different operations

### Performance:
- **Indexed Queries**: Fast lookups on common fields
- **Efficient Joins**: Optimized table relationships
- **JSON Storage**: Flexible data storage for complex structures

## Troubleshooting

### Common Issues:

1. **Connection Failed**
   - Verify your environment variables
   - Check if your Supabase project is active
   - Ensure your IP is not blocked

2. **Permission Denied**
   - Verify RLS policies are enabled
   - Check if user is authenticated
   - Ensure proper table permissions

3. **Schema Errors**
   - Check SQL syntax in the schema file
   - Verify all required extensions are available
   - Run schema in correct order

### Getting Help:
- Check Supabase documentation: [docs.supabase.com](https://docs.supabase.com)
- Review the SQL schema file for syntax
- Check browser console for detailed error messages

## Next Steps

After successful database setup:
1. ✅ Database schema is ready
2. ✅ Authentication is configured
3. ✅ Sample data is loaded
4. ✅ Ready for application development

You can now proceed with the next phase of development!
