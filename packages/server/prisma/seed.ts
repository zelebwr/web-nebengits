import { PrismaClient, RideStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const LOCATIONS = [
    "Gedung Rektorat ITS",
    "Masjid Manarul Ilmi",
    "Perpustakaan Pusat ITS",
    "Tower 1 ITS",
    "Tower 2 ITS",
    "Graha Sepuluh Nopember",
    "Bundaran ITS",
    "Departemen Teknik Informatika ITS",
    "Departemen Sistem Informasi ITS",
    "Departemen Teknik Elektro ITS",
    "Departemen Teknik Mesin ITS",
    "Departemen Teknik Sipil ITS",
    "Departemen Teknik Lingkungan ITS",
    "Departemen Arsitektur ITS",
    "Departemen Desain Produk Industri ITS",
    "Departemen Teknik Industri ITS",
    "Departemen Statistika ITS",
    "Departemen Matematika ITS",
    "Departemen Fisika ITS",
    "Departemen Kimia ITS",
    "Departemen Biologi ITS",
    "Departemen Teknik Perkapalan ITS",
    "Departemen Teknik Kelautan ITS",
    "Asrama Mahasiswa ITS",
    "Asrama Internasional ITS",
    "Kantin Pusat ITS",
    "Kantin Teknik Kelautan ITS",
    "Kantin Biologi ITS",
    "Kantin Teknik Mesin ITS",
    "Kantin Teknik Informatika ITS",
    "Kantin Perpustakaan ITS",
    "Student Community Center (SCC) ITS",
    "Gelanggang Olahraga (GOR) Pertamina ITS",
    "Stadion ITS",
    "Perumahan Dosen ITS",
    "Galaxy Mall",
    "Pakuwon City Mall Surabaya",
    "Pakuwon Mall Surabaya",
    "Tunjungan Plaza",
    "Pasar Keputih",
    "Gebang Lor",
    "Gebang Putih",
    "Sakinah Supermarket",
    "Stasiun Gubeng",
];

async function main() {
    console.log("🌱 Starting seed...");

    // 1. Clean the database
    await prisma.ride.deleteMany();
    await prisma.user.deleteMany();
    console.log("🧹 Database cleaned");

    // 2. Shared Password (hashed "123456")
    const hashedPassword = await bcrypt.hash("123456", 10);

    // 3. Create Core Users (For Demo)
    const budi = await prisma.user.create({
        data: {
            email: "budi@student.its.ac.id",
            name: "Budi Santoso",
            password: hashedPassword,
            phone: "081234567890",
            role: Role.STUDENT,
            greenPoints: 50,
            deletedAt: null, // Explicitly set null
        },
    });

    const siti = await prisma.user.create({
        data: {
            email: "siti@student.its.ac.id",
            name: "Siti Aminah",
            password: hashedPassword,
            phone: "081298765432",
            role: Role.STUDENT,
            greenPoints: 20,
            deletedAt: null, // Explicitly set null
        },
    });

    console.log("👤 Created Core Users: Budi & Siti");

    // 4. Create Batch Users (Drivers & Passengers)
    const users = [budi, siti];
    for (let i = 1; i <= 8; i++) {
        const user = await prisma.user.create({
            data: {
                email: `mahasiswa${i}@student.its.ac.id`,
                name: `Mahasiswa ITS ${i}`,
                password: hashedPassword,
                phone: `08120000000${i}`,
                role: Role.STUDENT,
                greenPoints: Math.floor(Math.random() * 100),
                deletedAt: null, // Explicitly set null
            },
        });
        users.push(user);
    }
    console.log("👥 Created 8 extra users");

    // 5. Create Rides
    type RideSeedData = {
        driverId: string;
        destination: string;
        pickupPoint: string;
        departureTime: Date;
        seatsAvailable: number;
        cost: number;
        status: RideStatus;
        passengerIds: string[];
    };

    const ridesToCreate: RideSeedData[] = [
        {
            driverId: budi.id,
            destination: "Gedung Rektorat ITS",
            pickupPoint: "Indomaret Gebang",
            departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000),
            seatsAvailable: 2,
            cost: 5000,
            status: RideStatus.OPEN,
            passengerIds: [],
        },
        {
            driverId: budi.id,
            destination: "Galaxy Mall",
            pickupPoint: "Departemen Informatika",
            departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000),
            seatsAvailable: 3,
            cost: 5000,
            status: RideStatus.OPEN,
            passengerIds: [],
        },
        {
            driverId: budi.id,
            destination: "Terminal Keputih",
            pickupPoint: "Asrama Mahasiswa",
            departureTime: new Date(Date.now() - 24 * 60 * 60 * 1000),
            seatsAvailable: 0,
            cost: 5000,
            status: RideStatus.COMPLETED,
            passengerIds: [siti.id],
        },
    ];

    for (let i = 0; i < 15; i++) {
        const driver = users[Math.floor(Math.random() * users.length)];
        const destination =
            LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        let pickup = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

        while (pickup === destination) {
            pickup = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        }

        const timeOffset = Math.random() * 7 * 24 * 60 * 60 * 1000;
        const departureTime = new Date(Date.now() + timeOffset);

        ridesToCreate.push({
            driverId: driver.id,
            destination,
            pickupPoint: pickup,
            departureTime,
            seatsAvailable: Math.floor(Math.random() * 3) + 1,
            cost: Math.floor(Math.random() * 3 + 1) * 2000,
            status: RideStatus.OPEN,
            passengerIds: [],
        });
    }

    for (const r of ridesToCreate) {
        await prisma.ride.create({
            data: {
                driverId: r.driverId,
                destination: r.destination,
                pickupPoint: r.pickupPoint,
                departureTime: r.departureTime,
                seatsAvailable: r.seatsAvailable,
                cost: r.cost,
                status: r.status,
                passengerIds: r.passengerIds,
                vehiclePhotoUrl:
                    "https://placehold.co/600x400/png?text=Vehicle+Photo",
                verificationCode: "8921",
                deletedAt: null,
            },
        });
    }

    console.log(`🚗 Created ${ridesToCreate.length} rides`);
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
