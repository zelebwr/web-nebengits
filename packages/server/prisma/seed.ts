// packages/server/prisma/seed.ts

import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
    console.log("🌱 Starting seed...");

    // 1. Clean the database
    await prisma.ride.deleteMany();
    await prisma.user.deleteMany();
    console.log("🧹 Database cleaned");

    // 2. Hash a dummy password (e.g., "123456")
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 3. Create a DRIVER (Budi)
    const driverBudi = await prisma.user.create({
        data: {
            email: "budi@student.its.ac.id",
            name: "Budi Santoso",
            password: hashedPassword,
            phone: "628123456789",
            greenPoints: 15, // Starts with points (simulating past rides)
            role: "STUDENT",
        },
    });
    console.log("👤 Created Driver: Budi");

    // 4. Create a PASSENGER (Siti)
    const passengerSiti = await prisma.user.create({
        data: {
            email: "siti@student.its.ac.id",
            name: "Siti Aminah",
            password: hashedPassword,
            phone: "628987654321",
            greenPoints: 5,
            role: "STUDENT",
        },
    });
    console.log("👤 Created Passenger: Siti");

    // 5. Create an UPCOMING RIDE
    await prisma.ride.create({
        data: {
            driverId: driverBudi.id,
            destination: "Gedung Rektorat ITS",
            pickupPoint: "Indomaret Gebang",
            // Set time to tomorrow morning
            departureTime: new Date(
                new Date().setHours(new Date().getHours() + 24)
            ),
            seatsAvailable: 2, // 1 seat already "taken" implicitly by logic or just set capacity
            cost: 10000,
            vehiclePhotoUrl:
                "https://placehold.co/600x400/png?text=Honda+Beat+Red",
            status: "OPEN",
            verificationCode: "8921", // The magic OTP code
        },
    });
    console.log("🚗 Created Ride: Budi -> Rektorat");

    console.log("✅ Seeding finished.");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
