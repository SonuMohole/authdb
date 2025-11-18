-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "organisationName" TEXT NOT NULL,
    "organisationSize" TEXT NOT NULL,
    "representative" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "companyEmail" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "mobile" TEXT NOT NULL,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "verificationToken" TEXT,
    "resetToken" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_companyEmail_key" ON "User"("companyEmail");

-- CreateIndex
CREATE UNIQUE INDEX "User_verificationToken_key" ON "User"("verificationToken");
