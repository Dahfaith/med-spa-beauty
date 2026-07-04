-- 1. Add scheduling columns to bookings table
ALTER TABLE bookings 
ADD COLUMN IF NOT EXISTS booking_date DATE,
ADD COLUMN IF NOT EXISTS booking_time TIME,
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;

-- 2. Add duration to services table so admins can edit it later
ALTER TABLE services
ADD COLUMN IF NOT EXISTS duration_minutes INTEGER DEFAULT 60;

-- 3. Create a secure function to fetch booked slots without exposing PII (bypassing RLS safely)
-- The public website will call this function to know which times to disable.
CREATE OR REPLACE FUNCTION get_booked_slots(target_date DATE)
RETURNS TABLE (
  booking_time TIME, 
  duration_minutes INTEGER
)
LANGUAGE sql
SECURITY DEFINER -- This allows the function to bypass RLS and read the bookings table
AS $$
  SELECT booking_time, duration_minutes 
  FROM bookings
  WHERE booking_date = target_date 
  AND status != 'Cancelled' 
  AND booking_time IS NOT NULL;
$$;
