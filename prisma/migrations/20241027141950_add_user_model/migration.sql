-- CreateTable
CREATE TABLE "Hosts" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "profileImage" TEXT,
    "refreshToken" TEXT,
    "accountStatus" TEXT NOT NULL DEFAULT 'pending',
    "lastLogin" TIMESTAMP(3),
    "verificationStatus" BOOLEAN NOT NULL DEFAULT false,
    "role" TEXT NOT NULL DEFAULT 'Individual',
    "preferredLanguage" TEXT,
    "timezone" TEXT,
    "rating" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "numberOfEventsHosted" INTEGER NOT NULL DEFAULT 0,
    "supportContactInfo" TEXT,
    "preferredCommunication" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Hosts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BusinessInformation" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL,
    "businessRegistration" TEXT NOT NULL,
    "taxDetails" TEXT NOT NULL,
    "businessType" TEXT NOT NULL,
    "websiteUrl" TEXT,
    "socialMediaLinks" JSONB,
    "businessDescription" TEXT,
    "businessLogo" TEXT,
    "kycStatus" BOOLEAN NOT NULL DEFAULT false,
    "complianceExpiration" TIMESTAMP(3),

    CONSTRAINT "BusinessInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BankingInformation" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "bankAccountDetails" TEXT NOT NULL,
    "revenueAgreement" TEXT NOT NULL,
    "preferredPaymentMethod" TEXT NOT NULL,
    "paymentFrequency" TEXT NOT NULL,
    "paymentThreshold" DOUBLE PRECISION NOT NULL,
    "taxFilingStatus" BOOLEAN NOT NULL DEFAULT false,
    "taxDocuments" JSONB,

    CONSTRAINT "BankingInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VenueInformation" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "seatingCapacity" INTEGER NOT NULL,
    "seatingCategories" JSONB NOT NULL,
    "seatingLayout" JSONB NOT NULL,
    "venueType" TEXT NOT NULL,
    "facilities" JSONB,
    "eventTypesSupported" JSONB,
    "venuePolicies" TEXT,
    "venuePhotos" JSONB,
    "pricingInformation" JSONB,
    "availabilityCalendar" JSONB,
    "venueAccessibility" JSONB,
    "venueSetupServices" JSONB,

    CONSTRAINT "VenueInformation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TicketCustomization" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "venueId" TEXT NOT NULL,
    "ticketTemplate" JSONB NOT NULL,
    "customTicketRules" JSONB NOT NULL,
    "ticketPriceTiers" JSONB NOT NULL,

    CONSTRAINT "TicketCustomization_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostAnalytics" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "totalTicketsSold" INTEGER NOT NULL DEFAULT 0,
    "totalRevenueGenerated" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "attendanceRate" DOUBLE PRECISION NOT NULL DEFAULT 0.0,
    "refundRequests" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "HostAnalytics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostPromotions" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "discountCodes" JSONB,
    "referralProgramDetails" JSONB,
    "adSpend" DOUBLE PRECISION NOT NULL DEFAULT 0.0,

    CONSTRAINT "HostPromotions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationPreferences" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "smsNotifications" BOOLEAN NOT NULL DEFAULT true,
    "alertPreferences" JSONB,
    "securityAlerts" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "NotificationPreferences_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HostTeamManagement" (
    "id" TEXT NOT NULL,
    "hostId" TEXT NOT NULL,
    "teamMemberId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "permissions" JSONB NOT NULL,

    CONSTRAINT "HostTeamManagement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "dateOfBirth" TEXT,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "profilePicture" TEXT,
    "Gender" TEXT,
    "Married" BOOLEAN,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserAddress" (
    "id" TEXT NOT NULL,
    "areaPincode" INTEGER NOT NULL,
    "addressLine1" TEXT NOT NULL,
    "addressLine2" TEXT NOT NULL,
    "landmark" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "UserAddress_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Hosts_email_key" ON "Hosts"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Hosts_phone_key" ON "Hosts"("phone");

-- CreateIndex
CREATE UNIQUE INDEX "BusinessInformation_hostId_key" ON "BusinessInformation"("hostId");

-- CreateIndex
CREATE UNIQUE INDEX "BankingInformation_hostId_key" ON "BankingInformation"("hostId");

-- CreateIndex
CREATE UNIQUE INDEX "HostAnalytics_hostId_key" ON "HostAnalytics"("hostId");

-- CreateIndex
CREATE UNIQUE INDEX "HostPromotions_hostId_key" ON "HostPromotions"("hostId");

-- CreateIndex
CREATE UNIQUE INDEX "NotificationPreferences_hostId_key" ON "NotificationPreferences"("hostId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "User_phone_key" ON "User"("phone");

-- AddForeignKey
ALTER TABLE "BusinessInformation" ADD CONSTRAINT "BusinessInformation_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BankingInformation" ADD CONSTRAINT "BankingInformation_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VenueInformation" ADD CONSTRAINT "VenueInformation_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketCustomization" ADD CONSTRAINT "TicketCustomization_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TicketCustomization" ADD CONSTRAINT "TicketCustomization_venueId_fkey" FOREIGN KEY ("venueId") REFERENCES "VenueInformation"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostAnalytics" ADD CONSTRAINT "HostAnalytics_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostPromotions" ADD CONSTRAINT "HostPromotions_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationPreferences" ADD CONSTRAINT "NotificationPreferences_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HostTeamManagement" ADD CONSTRAINT "HostTeamManagement_hostId_fkey" FOREIGN KEY ("hostId") REFERENCES "Hosts"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
