-- Update profile_image field from varchar(500) to LONGTEXT to accommodate base64 image data
ALTER TABLE users MODIFY COLUMN profile_image LONGTEXT NULL;
