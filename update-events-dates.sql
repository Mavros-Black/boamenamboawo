-- Update events with future dates (2025-2026)
UPDATE events SET 
  start_date = '2025-11-15 09:00:00+00',
  end_date = '2025-11-15 17:00:00+00'
WHERE id = 'youth-leadership-summit-2024';

UPDATE events SET 
  start_date = '2025-12-08 10:00:00+00',
  end_date = '2025-12-08 16:00:00+00'
WHERE id = 'digital-skills-workshop';

UPDATE events SET 
  start_date = '2025-12-20 18:00:00+00',
  end_date = '2025-12-20 22:00:00+00'
WHERE id = 'community-impact-awards';

-- Verify the updates
SELECT id, title, start_date, status FROM events ORDER BY start_date;