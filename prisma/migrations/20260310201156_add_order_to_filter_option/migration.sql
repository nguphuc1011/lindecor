-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FilterOption" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "category" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0
);
INSERT INTO "new_FilterOption" ("category", "id", "value") SELECT "category", "id", "value" FROM "FilterOption";
DROP TABLE "FilterOption";
ALTER TABLE "new_FilterOption" RENAME TO "FilterOption";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
