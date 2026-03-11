import sqlite3
import psycopg2
import os

# Cấu hình
SQLITE_DB = "./prisma/dev.db"
POSTGRES_URL = "postgresql://postgres:LinDecor%400822551209@db.hqojjjtzqgerurzdznqn.supabase.co:5432/postgres"

def migrate():
    print("🚀 Đang bắt đầu quá trình chuyển dữ liệu bộ lọc (Python)...")
    
    try:
        # 1. Kết nối SQLite
        sqlite_conn = sqlite3.connect(SQLITE_DB)
        sqlite_conn.row_factory = sqlite3.Row
        sqlite_cur = sqlite_conn.cursor()
        
        # Lấy dữ liệu FilterOption
        sqlite_cur.execute('SELECT category, value, "order", type FROM FilterOption')
        rows = sqlite_cur.fetchall()
        print(f"📦 Tìm thấy {len(rows)} bộ lọc trong SQLite.")
        
        if not rows:
            return

        # 2. Kết nối Postgres (Supabase)
        pg_conn = psycopg2.connect(POSTGRES_URL)
        pg_cur = pg_conn.cursor()
        
        print("🔗 Đã kết nối với Supabase. Đang đẩy dữ liệu...")
        
        # 3. Đẩy dữ liệu
        count = 0
        for row in rows:
            pg_cur.execute(
                'INSERT INTO "FilterOption" (id, category, value, "order", type) VALUES (gen_random_uuid(), %s, %s, %s, %s)',
                (row['category'], row['value'], row['order'], row['type'])
            )
            count += 1
            if count % 10 == 0:
                print(f"✅ Đã chuyển {count}/{len(rows)} bộ lọc...")
        
        pg_conn.commit()
        print(f"🎉 THÀNH CÔNG! Đã chuyển xong {count} bộ lọc.")

    except Exception as e:
        print(f"💥 Lỗi: {e}")
    finally:
        if 'sqlite_conn' in locals(): sqlite_conn.close()
        if 'pg_conn' in locals(): pg_conn.close()

if __name__ == "__main__":
    migrate()
