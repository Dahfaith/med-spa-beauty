-- ========================================================
-- MED SPA & BEAUTY ARENA: COMPLETE DATABASE SCRIPT
-- ========================================================
-- This file contains EVERYTHING needed to set up a fresh database:
-- 1. Table Definitions
-- 2. Row Level Security & Policies
-- 3. Initial Seed Data

-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- ==========================================
-- 1. TABLES
-- ==========================================

create table if not exists site_settings (
  id integer primary key default 1,
  location text,
  phone text,
  email text,
  hours_mon_fri text,
  hours_sat text,
  hours_sun text,
  academy_image_url text,
  hero_image_url text
);

create table if not exists services (
  id uuid primary key default uuid_generate_v4(),
  category text not null,
  title text not null,
  description text not null,
  benefits text,
  procedure_details text,
  duration text,
  recovery_time text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists courses (
  id uuid primary key default uuid_generate_v4(),
  title text not null,
  level text,
  duration text,
  fee text,
  description text not null,
  modules jsonb default '[]'::jsonb,
  benefits text,
  accommodation text,
  certification text,
  requirements text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists team_members (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text not null,
  bio text,
  image_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists gallery_images (
  id uuid primary key default uuid_generate_v4(),
  image_url text not null,
  category text not null, 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists testimonials (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  role text,
  content text not null,
  rating integer default 5,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists bookings (
  id uuid primary key default uuid_generate_v4(),
  first_name text not null,
  last_name text not null,
  email text not null,
  phone text,
  service_type text, 
  message text,
  status text default 'Pending', 
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- ==========================================
-- 2. ROW LEVEL SECURITY (RLS)
-- ==========================================

alter table site_settings enable row level security;
alter table services enable row level security;
alter table courses enable row level security;
alter table team_members enable row level security;
alter table gallery_images enable row level security;
alter table testimonials enable row level security;
alter table bookings enable row level security;

-- Drop existing policies if re-running
drop policy if exists "Allow public read access on site_settings" on site_settings;
drop policy if exists "Allow public update on site_settings" on site_settings;
drop policy if exists "Allow public insert on site_settings" on site_settings;
drop policy if exists "Allow auth update on site_settings" on site_settings;
drop policy if exists "Allow auth insert on site_settings" on site_settings;

drop policy if exists "Allow public read access on services" on services;
drop policy if exists "Allow public insert on services" on services;
drop policy if exists "Allow public update on services" on services;
drop policy if exists "Allow public delete on services" on services;
drop policy if exists "Allow auth insert on services" on services;
drop policy if exists "Allow auth update on services" on services;
drop policy if exists "Allow auth delete on services" on services;

drop policy if exists "Allow public read access on courses" on courses;
drop policy if exists "Allow public insert on courses" on courses;
drop policy if exists "Allow public update on courses" on courses;
drop policy if exists "Allow public delete on courses" on courses;
drop policy if exists "Allow auth insert on courses" on courses;
drop policy if exists "Allow auth update on courses" on courses;
drop policy if exists "Allow auth delete on courses" on courses;

drop policy if exists "Allow public read access on team_members" on team_members;
drop policy if exists "Allow public insert on team_members" on team_members;
drop policy if exists "Allow public update on team_members" on team_members;
drop policy if exists "Allow public delete on team_members" on team_members;
drop policy if exists "Allow auth insert on team_members" on team_members;
drop policy if exists "Allow auth update on team_members" on team_members;
drop policy if exists "Allow auth delete on team_members" on team_members;

drop policy if exists "Allow public read access on gallery_images" on gallery_images;
drop policy if exists "Allow public insert on gallery_images" on gallery_images;
drop policy if exists "Allow public delete on gallery_images" on gallery_images;
drop policy if exists "Allow auth insert on gallery_images" on gallery_images;
drop policy if exists "Allow auth delete on gallery_images" on gallery_images;

drop policy if exists "Allow public read access on testimonials" on testimonials;
drop policy if exists "Allow public insert on testimonials" on testimonials;
drop policy if exists "Allow public update on testimonials" on testimonials;
drop policy if exists "Allow public delete on testimonials" on testimonials;
drop policy if exists "Allow auth insert on testimonials" on testimonials;
drop policy if exists "Allow auth update on testimonials" on testimonials;
drop policy if exists "Allow auth delete on testimonials" on testimonials;

drop policy if exists "Allow public insert on bookings" on bookings;
drop policy if exists "Allow public update on bookings" on bookings;
drop policy if exists "Allow public delete on bookings" on bookings;
drop policy if exists "Allow auth update on bookings" on bookings;
drop policy if exists "Allow auth delete on bookings" on bookings;

-- ==========================================
-- 3. CREATE SECURE POLICIES
-- ==========================================

-- Allow Public Reads
create policy "Allow public read access on site_settings" on site_settings for select using (true);
create policy "Allow public read access on services" on services for select using (true);
create policy "Allow public read access on courses" on courses for select using (true);
create policy "Allow public read access on team_members" on team_members for select using (true);
create policy "Allow public read access on gallery_images" on gallery_images for select using (true);
create policy "Allow public read access on testimonials" on testimonials for select using (true);

-- Allow Public Inserts for Contact Form
create policy "Allow public insert on bookings" on bookings for insert with check (true);

-- Require Authentication for Admin Actions
create policy "Allow auth update on site_settings" on site_settings for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow auth insert on site_settings" on site_settings for insert with check (auth.role() = 'authenticated');

create policy "Allow auth insert on services" on services for insert with check (auth.role() = 'authenticated');
create policy "Allow auth update on services" on services for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow auth delete on services" on services for delete using (auth.role() = 'authenticated');

create policy "Allow auth insert on courses" on courses for insert with check (auth.role() = 'authenticated');
create policy "Allow auth update on courses" on courses for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow auth delete on courses" on courses for delete using (auth.role() = 'authenticated');

create policy "Allow auth insert on team_members" on team_members for insert with check (auth.role() = 'authenticated');
create policy "Allow auth update on team_members" on team_members for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow auth delete on team_members" on team_members for delete using (auth.role() = 'authenticated');

create policy "Allow auth insert on gallery_images" on gallery_images for insert with check (auth.role() = 'authenticated');
create policy "Allow auth delete on gallery_images" on gallery_images for delete using (auth.role() = 'authenticated');

create policy "Allow auth insert on testimonials" on testimonials for insert with check (auth.role() = 'authenticated');
create policy "Allow auth update on testimonials" on testimonials for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow auth delete on testimonials" on testimonials for delete using (auth.role() = 'authenticated');

create policy "Allow auth update on bookings" on bookings for update using (auth.role() = 'authenticated') with check (auth.role() = 'authenticated');
create policy "Allow auth delete on bookings" on bookings for delete using (auth.role() = 'authenticated');

-- ==========================================
-- 4. MASTER SEED DATA
-- ==========================================

INSERT INTO site_settings (id, location, phone, email, hours_mon_fri, hours_sat, hours_sun)
VALUES (
  1, 
  '123 Beauty Avenue, Victoria Island, Lagos, Nigeria', 
  '+2349153489582', 
  'hello@medspabeauty.com
academy@medspabeauty.com', 
  '9:00 AM - 7:00 PM', 
  '10:00 AM - 5:00 PM', 
  'Closed'
) ON CONFLICT (id) DO NOTHING;

INSERT INTO courses (title, level, duration, fee, description, modules, benefits, accommodation, certification, requirements, image_url)
VALUES 
(
  'Intensive Spa & Med-Esthetic Training (Beginner Class)',
  'Beginner',
  '2 Weeks',
  '₦500,000',
  'Comprehensive foundation in spa and aesthetic treatments. Perfect for individuals starting a new career in the beauty industry.',
  '["Basic Facial", "Microdermabrasion", "Hydra Facial", "Glow Facial", "Dermaplaning Facial", "Deep Cleansing & Acne Facial", "Facial Massage", "Swedish Massage", "Deep-Tissue Massage", "Pre-Natal Massage", "Aromatherapy", "Pedicure & Manicure", "Teeth Whitening", "Skin Tag Removal", "Turmeric Body Wash", "Whitening Body Wash", "Body Repair Wash", "Glow Body Wash", "Moroccan Whitening", "Sugar Body Wash"]'::jsonb,
  'First 2 people to make payment will get a FREE advanced makeup facials training class.',
  'FREE Accommodation provided',
  'Certificate will be issued upon completion of training',
  'Limited to 5 slots only.',
  'https://images.unsplash.com/photo-1614859324967-bdf4736f87ce?auto=format&fit=crop&q=80'
),
(
  'Intensive Spa & Med-Esthetic Training (Advanced Class)',
  'Advanced',
  '2 Weeks',
  '₦700,000',
  'Advanced medical aesthetics and body contouring techniques designed to elevate your professional practice.',
  '["Arm Reduction", "Face Reduction", "Tummy Reduction", "Thigh Reduction", "Back Fold Reduction", "Hydra Glow Facial", "Microdermabrasion", "Dermaplaning Facial", "Deep Cleansing & Acne Facial", "Vampire Facial (PRP)", "Butt Enhancer", "Breast Enhancer", "Hairloss Treatment", "O-Shot", "P-Shot", "Vacuum Therapy", "Wood Therapy", "Laser Lipo", "Whitening Drip", "Glow-Cocktail", "Snow White Drip", "Immune Booster", "Detoxification", "Weightloss Injection", "Weight Gain Drip"]'::jsonb,
  'First 2 people to make payment will get a FREE advanced makeup facials training class.',
  'FREE Accommodation provided',
  'Certificate will be issued upon completion of training',
  'Limited to 5 slots only.',
  'https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&q=80'
),
(
  'Intensive Spa & Med-Esthetic Training (Master Class)',
  'Master',
  '1 Week',
  '₦1,000,000',
  'Elite masterclass covering highly specialized injectable treatments, PDO threads, and advanced fillers for expert practitioners.',
  '["Types of Thread", "Face Lift with Thread", "Nose Augmentation", "Breast Lift with Thread", "Butt Lift with Thread", "Mono Thread Usage", "PDO Thread Complications", "Full Face Fillers", "Hand Rejuvenation", "Butt Filler", "Filler Complications", "Botox", "Skin Booster", "Chemical Peel", "Herbal Peel", "Sclerotherapy"]'::jsonb,
  'First 2 people to make payment will get a FREE advanced tattoo removal training class.',
  'FREE Accommodation provided',
  'Certificate will be issued upon completion of practicals',
  'Limited to 5 slots only.',
  'https://images.unsplash.com/photo-1552697611-650ce8528994?auto=format&fit=crop&q=80'
);

INSERT INTO testimonials (name, role, content, rating)
VALUES 
(
  'Sarah O.',
  'Spa Client',
  'The best medical spa experience I have ever had. The staff is incredibly professional, the clinic is spotless, and the results from my Hydra Facial were absolutely glowing. I cannot recommend them enough!',
  5
),
(
  'Dr. Amina K.',
  'Academy Graduate',
  'Enrolling in the 1-Week Masterclass completely changed my career trajectory. The hands-on PDO Thread and Filler training gave me the exact confidence and skills I needed to expand my own aesthetic practice.',
  5
),
(
  'Jessica T.',
  'Spa Client',
  'Luxurious environment and top-tier service. I came in for the body contouring and wood therapy sessions and have already seen a massive difference in just three weeks. Truly premium service.',
  5
),
(
  'Michelle B.',
  'Academy Graduate',
  'I took the 2 Weeks Beginner Class with zero prior experience in aesthetics. The instructors were so patient and the free accommodation was a lifesaver. I am now officially a certified esthetician!',
  5
),
(
  'Linda E.',
  'Spa Client',
  'I booked a deep tissue massage and a glow facial for my birthday weekend. It was the most relaxing, rejuvenating experience of my life. The team here really knows how to treat you like royalty.',
  5
);
