import { PrismaClient, RideStatus, Role } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const LOCATIONS = [
    "Gedung Rektorat ITS",
    "Masjid Manarul Ilmi",
    "Perpusatakaan Pusat ITS",
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
    "Depatemen Biologi ITS", 
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
            },
        });
        users.push(user);
    }
    console.log("👥 Created 8 extra users");

    // 5. Create Rides
    // Define the type explicitly to avoid 'never[]' inference issues
    type RideSeedData = {
        driverId: string;
        destination: string;
        pickupPoint: string;
        departureTime: Date;
        seatsAvailable: number;
        cost: number;
        status: RideStatus;
        passengerIds: string[]; // Explicit type here fixes the error
    };

    const ridesToCreate: RideSeedData[] = [
        // Specific Rides for Budi (So you can demo them easily)
        {
            driverId: budi.id,
            destination: "Gedung Rektorat ITS",
            pickupPoint: "Indomaret Gebang",
            departureTime: new Date(Date.now() + 24 * 60 * 60 * 1000), // Tomorrow
            seatsAvailable: 2,
            cost: 10000,
            status: RideStatus.OPEN,
            passengerIds: [],
        },
        {
            driverId: budi.id,
            destination: "Galaxy Mall",
            pickupPoint: "Departemen Informatika",
            departureTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // In 2 hours
            seatsAvailable: 3,
            cost: 15000,
            status: RideStatus.OPEN,
            passengerIds: [],
        },
        {
            driverId: budi.id,
            destination: "Terminal Keputih",
            pickupPoint: "Asrama Mahasiswa",
            departureTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
            seatsAvailable: 0,
            cost: 5000,
            status: RideStatus.COMPLETED, // Past ride
            passengerIds: [siti.id],
        },
    ];

    // Generate random rides from other users
    for (let i = 0; i < 15; i++) {
        const driver = users[Math.floor(Math.random() * users.length)];
        const destination =
            LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        let pickup = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];

        // Ensure pickup != destination
        while (pickup === destination) {
            pickup = LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)];
        }

        // Random time between now and next 7 days
        const timeOffset = Math.random() * 7 * 24 * 60 * 60 * 1000;
        const departureTime = new Date(Date.now() + timeOffset);

        ridesToCreate.push({
            driverId: driver.id,
            destination,
            pickupPoint: pickup,
            departureTime,
            seatsAvailable: Math.floor(Math.random() * 3) + 1, // 1 to 3 seats
            cost: Math.floor(Math.random() * 4 + 1) * 5000, // 5k, 10k, 15k, 20k
            status: RideStatus.OPEN,
            passengerIds: [], // No passengers yet
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
                passengerIds: r.passengerIds, // Now safe because it's string[]
                vehiclePhotoUrl:
                    "https://placehold.co/600x400/png?text=Vehicle+Photo", // Mock Image
                verificationCode: "8921", // Hardcoded OTP for easy testing
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
