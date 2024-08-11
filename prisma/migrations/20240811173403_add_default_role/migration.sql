-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_picture" TEXT,
    "role" TEXT NOT NULL DEFAULT 'user'
);
INSERT INTO "new_User" ("email", "first_name", "id", "last_name", "mobile_number", "password", "profile_picture", "role") SELECT "email", "first_name", "id", "last_name", "mobile_number", "password", "profile_picture", "role" FROM "User";
DROP TABLE "User";
ALTER TABLE "new_User" RENAME TO "User";
CREATE UNIQUE INDEX "User_mobile_number_key" ON "User"("mobile_number");
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
