-- Update notifications table to include 'comment' type in enum
ALTER TABLE notifications
MODIFY COLUMN type ENUM('info','warning','error','success','task_assigned','task_completed','task_overdue','comment') NULL DEFAULT 'info';
