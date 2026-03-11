/*
  Warnings:

  - You are about to drop the column `customFilters` on the `Product` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "price" REAL NOT NULL,
    "imageUrl" TEXT,
    "category" TEXT,
    "type" TEXT,
    "theme" TEXT,
    "gender" TEXT,
    "ageRange" TEXT,
    "location" TEXT,
    "space" TEXT,
    "scale" TEXT,
    "color" TEXT,
    "priceRange" TEXT,
    "filterData" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Product" ("ageRange", "category", "color", "createdAt", "description", "gender", "id", "imageUrl", "location", "name", "price", "priceRange", "scale", "space", "theme", "type") SELECT "ageRange", "category", "color", "createdAt", "description", "gender", "id", "imageUrl", "location", "name", "price", "priceRange", "scale", "space", "theme", "type" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
