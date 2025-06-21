/*
  # Add missing columns to cigars table

  1. New Columns
    - `added_date` (timestamptz) - When the cigar was added to the collection
    - `aging_start_date` (timestamptz) - When aging began for the cigar
    - `ring_gauge` (integer) - Ring gauge measurement
    - `factory` (text) - Manufacturing factory
    - `release_year` (integer) - Year the cigar was released
    - `purchase_location` (text) - Where the cigar was purchased
    - `low_stock_alert` (integer) - Quantity threshold for low stock alerts
    - `tags` (text array) - User-defined tags for the cigar
    - `photo` (text) - Photo URL or base64 data

  2. Updates
    - Set default values for new columns to ensure data consistency
    - Add constraints where appropriate
*/

-- Add missing columns to cigars table
DO $$
BEGIN
  -- Add added_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cigars' AND column_name = 'added_date'
  ) THEN
    ALTER TABLE cigars ADD COLUMN added_date timestamptz DEFAULT now();
  END IF;

  -- Add aging_start_date column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cigars' AND column_name = 'aging_start_date'
  ) THEN
    ALTER TABLE cigars ADD COLUMN aging_start_date timestamptz DEFAULT now();
  END IF;

  -- Add ring_gauge column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cigars' AND column_name = 'ring_gauge'
  ) THEN
    ALTER TABLE cigars ADD COLUMN ring_gauge integer;
  END IF;

  -- Add factory column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cigars' AND column_name = 'factory'
  ) THEN
    ALTER TABLE cigars ADD COLUMN factory text;
  END IF;

  -- Add release_year column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cigars' AND column_name = 'release_year'
  ) THEN
    ALTER TABLE cigars ADD COLUMN release_year integer;
  END IF;

  -- Add purchase_location column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cigars' AND column_name = 'purchase_location'
  ) THEN
    ALTER TABLE cigars ADD COLUMN purchase_location text;
  END IF;

  -- Add low_stock_alert column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cigars' AND column_name = 'low_stock_alert'
  ) THEN
    ALTER TABLE cigars ADD COLUMN low_stock_alert integer DEFAULT 5;
  END IF;

  -- Add tags column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cigars' AND column_name = 'tags'
  ) THEN
    ALTER TABLE cigars ADD COLUMN tags text[] DEFAULT '{}';
  END IF;

  -- Add photo column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'cigars' AND column_name = 'photo'
  ) THEN
    ALTER TABLE cigars ADD COLUMN photo text;
  END IF;
END $$;

-- Add constraints
ALTER TABLE cigars 
  ADD CONSTRAINT check_release_year 
  CHECK (release_year IS NULL OR (release_year >= 1900 AND release_year <= EXTRACT(YEAR FROM CURRENT_DATE)));

ALTER TABLE cigars 
  ADD CONSTRAINT check_low_stock_alert 
  CHECK (low_stock_alert > 0);

ALTER TABLE cigars 
  ADD CONSTRAINT check_ring_gauge 
  CHECK (ring_gauge IS NULL OR ring_gauge > 0);