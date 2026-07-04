-- MASTER FIX FOR ALL BOOKING POLICIES
-- Run this in your Supabase SQL Editor to guarantee bookings flow perfectly

-- 1. Enable RLS on bookings table (just in case it was off)
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- 2. Delete ALL existing policies on bookings to start fresh and clean
DROP POLICY IF EXISTS "Allow public insert on bookings" ON bookings;
DROP POLICY IF EXISTS "Allow admin read bookings" ON bookings;
DROP POLICY IF EXISTS "Enable insert for all users" ON bookings;
DROP POLICY IF EXISTS "Enable read access for all users" ON bookings;
DROP POLICY IF EXISTS "Enable read access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable all access for authenticated users" ON bookings;
DROP POLICY IF EXISTS "Enable public to insert bookings" ON bookings;

-- 3. Create the perfect policies
-- Policy A: Anyone on the internet can submit a booking form
CREATE POLICY "Public can insert bookings" 
ON bookings FOR INSERT 
TO public 
WITH CHECK (true);

-- Policy B: The Admin (authenticated user) can read, update, and delete all bookings
CREATE POLICY "Admin has full access to bookings" 
ON bookings FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- 4. Just in case, grant usage to anonymous users so they can use the get_booked_slots function
GRANT EXECUTE ON FUNCTION get_booked_slots(DATE) TO anon;
GRANT EXECUTE ON FUNCTION get_booked_slots(DATE) TO authenticated;
