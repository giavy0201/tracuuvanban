-- CreateTable
CREATE TABLE "activities" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "activities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "documents" (
    "id" VARCHAR(50) NOT NULL,
    "date" DATE NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "code" VARCHAR(50) NOT NULL,
    "ref_number" VARCHAR(100) NOT NULL,
    "created_at" TIMESTAMP(6) NOT NULL,
    "issued_date" DATE NOT NULL,
    "summary" TEXT NOT NULL,
    "urgency" VARCHAR(50) NOT NULL,
    "confidentiality" VARCHAR(50) NOT NULL,
    "type" VARCHAR(50),
    "authority" VARCHAR(50),
    "field" VARCHAR(50),
    "signer" VARCHAR(100) NOT NULL,
    "recipients" TEXT,
    "file" VARCHAR(100) NOT NULL,
    "pages" INTEGER NOT NULL,

    CONSTRAINT "documents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "issuing_agency" (
    "id" VARCHAR(50) NOT NULL,
    "name" VARCHAR(255) NOT NULL,

    CONSTRAINT "issuing_agency_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admins" (
    "id" TEXT NOT NULL,
    "username" VARCHAR(100) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_username_key" ON "admins"("username");

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_authority_fkey" FOREIGN KEY ("authority") REFERENCES "issuing_agency"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_field_fkey" FOREIGN KEY ("field") REFERENCES "activities"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_type_fkey" FOREIGN KEY ("type") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION;
