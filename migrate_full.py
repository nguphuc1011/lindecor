import sqlite3
import psycopg2
from psycopg2.extras import RealDictCursor
import uuid
import json

# Cấu hình
SQLITE_DB = "./prisma/dev.db"
POSTGRES_URL = "postgresql://postgres:LinDecor%400822551209@db.hqojjjtzqgerurzdznqn.supabase.co:5432/postgres"

def migrate():
    print("🚀 Đang bắt đầu chuyển TOÀN BỘ dữ liệu (Product, Banner, Service, Setting, Filter)...")
    
    try:
        # 1. Kết nối
        sqlite_conn = sqlite3.connect(SQLITE_DB)
        sqlite_conn.row_factory = sqlite3.Row
        sqlite_cur = sqlite_conn.cursor()
        
        pg_conn = psycopg2.connect(POSTGRES_URL)
        pg_cur = pg_conn.cursor()

        # 2. Chuyển FilterOption (Xóa cũ trên PG để tránh trùng)
        print("🔄 Đang đồng bộ FilterOption...")
        sqlite_cur.execute('SELECT category, value, "order", type FROM FilterOption')
        filters = sqlite_cur.fetchall()
        pg_cur.execute('DELETE FROM "FilterOption"')
        for f in filters:
            pg_cur.execute(
                'INSERT INTO "FilterOption" (id, category, value, "order", type) VALUES (%s, %s, %s, %s, %s)',
                (str(uuid.uuid4()), f['category'], f['value'], f['order'], f['type'])
            )
        print(f"✅ Đã chuyển {len(filters)} bộ lọc.")

        # 3. Chuyển Setting
        print("🔄 Đang đồng bộ Setting...")
        sqlite_cur.execute('SELECT "key", value FROM Setting')
        settings = sqlite_cur.fetchall()
        for s in settings:
            pg_cur.execute(
                'INSERT INTO "Setting" ("key", value) VALUES (%s, %s) ON CONFLICT ("key") DO UPDATE SET value = EXCLUDED.value',
                (s['key'], s['value'])
            )
        print(f"✅ Đã chuyển {len(settings)} cài đặt.")

        # 4. Chuyển Banner
        print("🔄 Đang đồng bộ Banner...")
        sqlite_cur.execute('SELECT title, description, imageUrl, buttonText, buttonLink, "order" FROM Banner')
        banners = sqlite_cur.fetchall()
        pg_cur.execute('DELETE FROM "Banner"')
        for b in banners:
            pg_cur.execute(
                'INSERT INTO "Banner" (id, title, description, "imageUrl", "buttonText", "buttonLink", "order") VALUES (%s, %s, %s, %s, %s, %s, %s)',
                (str(uuid.uuid4()), b['title'], b['description'], b['imageUrl'], b['buttonText'], b['buttonLink'], b['order'])
            )
        print(f"✅ Đã chuyển {len(banners)} banner.")

        # 5. Chuyển Service
        print("🔄 Đang đồng bộ Service...")
        sqlite_cur.execute('SELECT title, description, imageUrl, iconName, "order" FROM Service')
        services = sqlite_cur.fetchall()
        pg_cur.execute('DELETE FROM "Service"')
        for s in services:
            pg_cur.execute(
                'INSERT INTO "Service" (id, title, description, "imageUrl", "iconName", "order") VALUES (%s, %s, %s, %s, %s, %s)',
                (str(uuid.uuid4()), s['title'], s['description'], s['imageUrl'], s['iconName'], s['order'])
            )
        print(f"✅ Đã chuyển {len(services)} dịch vụ.")

        # 6. Chuyển Product
        print("🔄 Đang đồng bộ Product...")
        sqlite_cur.execute('SELECT name, code, description, price, imageUrl, category, type, filterData FROM Product')
        products = sqlite_cur.fetchall()
        pg_cur.execute('DELETE FROM "Product"')
        for p in products:
            pg_cur.execute(
                'INSERT INTO "Product" (id, name, code, description, price, "imageUrl", category, type, "filterData") VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)',
                (str(uuid.uuid4()), p['name'], p['code'], p['description'], p['price'], p['imageUrl'], p['category'], p['type'], p['filterData'])
            )
        print(f"✅ Đã chuyển {len(products)} sản phẩm.")

        pg_conn.commit()
        print("🎉 TẤT CẢ DỮ LIỆU ĐÃ ĐƯỢC ĐỒNG BỘ LÊN SUPABASE THÀNH CÔNG!")

    except Exception as e:
        print(f"💥 Lỗi: {e}")
        if 'pg_conn' in locals(): pg_conn.rollback()
    finally:
        if 'sqlite_conn' in locals(): sqlite_conn.close()
        if 'pg_conn' in locals(): pg_conn.close()

if __name__ == "__main__":
    migrate()
