-- CreateTable
CREATE TABLE "Test" (
    "id" STRING NOT NULL,
    "name" STRING NOT NULL,
    "content" STRING,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Test_pkey" PRIMARY KEY ("id")
);
