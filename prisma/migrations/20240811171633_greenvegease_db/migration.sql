-- CreateTable
CREATE TABLE "User" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "mobile_number" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profile_picture" TEXT
);

-- CreateIndex
CREATE UNIQUE INDEX "User_mobile_number_key" ON "User"("mobile_number");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");
