-- Update the Staff & Workers category to Support Staff
UPDATE relaxation_categories 
SET 
  name = 'Support Staff',
  description = 'Stress relief for support staff members'
WHERE slug = 'staff';