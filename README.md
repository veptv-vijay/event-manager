# Event Manager App — Complete Setup Guide

## 🚀 Quick Start

### 1. Install Dependencies
```bash
npm install @supabase/supabase-js@2.39.0 react-qr-code qrcode
npm install --save-dev @types/qrcode
```

### 2. Install Tailwind & Next.js (if fresh install)
```bash
npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --no-turbopack
```

### 3. Environment Variables
Create `.env.local` in root:
```
NEXT_PUBLIC_SUPABASE_URL=https://yviviyjrllglzmiemca.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 4. Run Development Server
```bash
npm run dev
```

## 📁 File Structure
```
src/app/
├── page.tsx                    # Homepage
├── layout.tsx                  # Root layout
├── globals.css                 # Global styles
├── auth/
│   ├── login/page.tsx         # Login page
│   └── register/page.tsx      # Register page
├── events/
│   ├── page.tsx               # Events listing
│   └── [id]/page.tsx          # Event detail + booking
├── dashboard/
│   └── page.tsx               # User dashboard + QR tickets
└── admin/
    ├── page.tsx               # Admin dashboard (login protected)
    ├── events/
    │   ├── page.tsx           # Manage events
    │   ├── create/page.tsx    # Create event
    │   └── [id]/edit/page.tsx # Edit event
    ├── bookings/page.tsx      # View all bookings
    ├── users/page.tsx         # Manage users
    └── reports/page.tsx       # Analytics & reports
src/lib/
└── supabase.ts                # Supabase client
```

## 🔐 Admin Login
- Email: admin@eventmanager.com
- Password: Admin@123

## 🗄️ Supabase SQL Setup
Run this in Supabase SQL Editor:

```sql
-- Users Profile Table
create table profiles (
  id uuid references auth.users on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  role text default 'attendee',
  phone text,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  primary key (id)
);

-- Events Table
create table events (
  id uuid default gen_random_uuid() primary key,
  title text not null,
  description text,
  banner_url text,
  date timestamp with time zone not null,
  venue text,
  category text,
  price decimal default 0,
  max_participants integer,
  current_participants integer default 0,
  status text default 'active',
  created_by uuid references profiles(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Bookings Table
create table bookings (
  id uuid default gen_random_uuid() primary key,
  event_id uuid references events(id) on delete cascade,
  user_id uuid references profiles(id) on delete cascade,
  ticket_type text default 'regular',
  quantity integer default 1,
  total_amount decimal,
  payment_status text default 'pending',
  qr_code text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- Row Level Security
alter table events enable row level security;
create policy "Events are viewable by everyone" on events for select using (true);
create policy "Admins can insert events" on events for insert with check (true);
create policy "Admins can update events" on events for update using (true);
create policy "Admins can delete events" on events for delete using (true);

alter table profiles enable row level security;
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can insert their own profile" on profiles for insert with check (true);
create policy "Users can update own profile" on profiles for update using (true);

alter table bookings enable row level security;
create policy "Bookings viewable by owner" on bookings for select using (true);
create policy "Users can create bookings" on bookings for insert with check (true);
create policy "Users can update own bookings" on bookings for update using (true);
```

## 🌐 Deploy to Vercel
1. Push to GitHub
2. Import to Vercel
3. Add environment variables
4. Deploy!
