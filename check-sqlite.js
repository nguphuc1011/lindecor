import sqlite3 from 'better-sqlite3';
import path from 'path';

const dbPath = path.resolve('prisma/dev.db');
const db = new sqlite3(dbPath);

try {
  const products = db.prepare('SELECT count(*) as count FROM Product').get();
  const filters = db.prepare('SELECT count(*) as count FROM FilterOption').get();
  const banners = db.prepare('SELECT count(*) as count FROM Banner').get();
  
  console.log('--- DỮ LIỆU TRONG SQLITE ---');
  console.log('Sản phẩm:', products.count);
  console.log('Bộ lọc:', filters.count);
  console.log('Banner:', banners.count);
} catch (err) {
  console.error('Lỗi khi đọc SQLite:', err.message);
} finally {
  db.close();
}
