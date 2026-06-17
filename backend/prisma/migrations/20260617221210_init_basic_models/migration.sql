-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "assigned_location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Driver" (
    "id" SERIAL NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "national_id" TEXT NOT NULL,

    CONSTRAINT "Driver_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Vehicle" (
    "id" SERIAL NOT NULL,
    "license_plate" TEXT NOT NULL,
    "model" TEXT NOT NULL,
    "passenger_capacity" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "current_location" TEXT NOT NULL,
    "queue_entry_at" TIMESTAMP(3),
    "driver_id" INTEGER NOT NULL,

    CONSTRAINT "Vehicle_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Trip" (
    "id" SERIAL NOT NULL,
    "vehicle_id" INTEGER NOT NULL,
    "departure_operator_id" INTEGER NOT NULL,
    "arrival_operator_id" INTEGER,
    "origin" TEXT NOT NULL,
    "destination" TEXT NOT NULL,
    "occupied_seats" INTEGER NOT NULL,
    "price_per_passenger" DECIMAL(65,30) NOT NULL,
    "base_commission" DECIMAL(65,30) NOT NULL,
    "status" TEXT NOT NULL,
    "departure_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "arrival_at" TIMESTAMP(3),

    CONSTRAINT "Trip_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Driver_national_id_key" ON "Driver"("national_id");

-- CreateIndex
CREATE UNIQUE INDEX "Vehicle_license_plate_key" ON "Vehicle"("license_plate");

-- AddForeignKey
ALTER TABLE "Vehicle" ADD CONSTRAINT "Vehicle_driver_id_fkey" FOREIGN KEY ("driver_id") REFERENCES "Driver"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_vehicle_id_fkey" FOREIGN KEY ("vehicle_id") REFERENCES "Vehicle"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_departure_operator_id_fkey" FOREIGN KEY ("departure_operator_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Trip" ADD CONSTRAINT "Trip_arrival_operator_id_fkey" FOREIGN KEY ("arrival_operator_id") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
