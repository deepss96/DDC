#!/bin/bash

echo "🔄 Starting Database Migration: Local → Live"
echo "=============================================="

# Database credentials
LIVE_HOST="srv947.hstgr.io"
LIVE_USER="u779658787_ddnirmaan_user"
LIVE_PASS="P0wer@2025"
LIVE_DB="u779658787_ddc_nirmaan_db"

echo "📊 Current Data Counts:"
echo "Local Database (ddc_developer):"
mysql -u root -e "USE ddc_developer; SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users UNION SELECT 'Tasks', COUNT(*) FROM tasks UNION SELECT 'Leads', COUNT(*) FROM leads UNION SELECT 'Notifications', COUNT(*) FROM notifications;"

echo ""
echo "Live Database ($LIVE_DB):"
mysql -h $LIVE_HOST -u $LIVE_USER -p$LIVE_PASS -e "USE $LIVE_DB; SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users UNION SELECT 'Tasks', COUNT(*) FROM tasks UNION SELECT 'Leads', COUNT(*) FROM leads UNION SELECT 'Notifications', COUNT(*) FROM notifications;"

echo ""
read -p "⚠️  This will REPLACE all data in live database. Continue? (y/N): " -n 1 -r
echo
if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "❌ Migration cancelled by user."
    exit 1
fi

echo ""
echo "💾 Creating backup of live database..."
mysqldump -h $LIVE_HOST -u $LIVE_USER -p$LIVE_PASS $LIVE_DB > live_database_backup_$(date +%Y%m%d_%H%M%S).sql

echo "🗑️  Clearing live database tables..."
mysql -h $LIVE_HOST -u $LIVE_USER -p$LIVE_PASS -e "
USE $LIVE_DB;
SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE taskcomments;
TRUNCATE TABLE notifications;
TRUNCATE TABLE tasks;
TRUNCATE TABLE leads;
TRUNCATE TABLE employees;
TRUNCATE TABLE users;
SET FOREIGN_KEY_CHECKS = 1;
"

echo "📤 Importing local database to live..."
mysql -h $LIVE_HOST -u $LIVE_USER -p$LIVE_PASS $LIVE_DB < local_database_backup.sql

echo ""
echo "✅ Migration completed! Verifying data transfer..."
echo "Live Database after migration:"
mysql -h $LIVE_HOST -u $LIVE_USER -p$LIVE_PASS -e "USE $LIVE_DB; SELECT 'Users' as Table_Name, COUNT(*) as Count FROM users UNION SELECT 'Tasks', COUNT(*) FROM tasks UNION SELECT 'Leads', COUNT(*) FROM leads UNION SELECT 'Notifications', COUNT(*) FROM notifications;"

echo ""
echo "🎉 Migration successful! Local database data has been transferred to live database."
echo "📁 Backup of live database saved as: live_database_backup_*.sql"
