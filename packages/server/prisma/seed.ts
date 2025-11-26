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

// Helper to generate random 4-digit OTP
const generateOTP = () => {
    return Math.floor(1000 + Math.random() * 9000).toString();
};

// Helper to get a random vehicle image URL
// Using Unsplash keywords to get real car/bike photos
const getRandomVehicleImage = (index: number) => {
    const keywords = ["car", "scooter", "motorcycle", "vehicle", "traffic"];
    // Use index to ensure we get slightly different images if the service supports it, 
    // or just rely on the random keyword.
    // 'source.unsplash.com' is deprecated/unreliable recently, so we use a reliable placeholder service 
    // that supports 'real' looking images or use a specific set of Unsplash IDs if needed.
    // For reliability in a demo without an API key, 'loremflickr' is a good alternative for specific keywords.
    
    const keyword = keywords[index % keywords.length];
    // Random lock to prevent caching same image
    const lock = Math.floor(Math.random() * 1000); 
    return `https://loremflickr.com/640/480/${keyword}?lock=${lock}`;
};

async function main() {
    console.log("🌱 Start seeding...");

    // 1. Clean up existing data
    await prisma.ride.deleteMany();
    await prisma.user.deleteMany();

    const hashedPassword = await bcrypt.hash("password123", 10);

    // 2. Define Fixed Users List
    const fixedUsers = [
        // Admin
        {
            email: "admin@its.ac.id",
            name: "Admin ITS",
            role: Role.ADMIN,
            phone: "08111111111",
        },
        // Drivers (Students who offer rides)
        {
            email: "budi@student.its.ac.id",
            name: "Budi Santoso",
            role: Role.STUDENT,
            phone: "08122222221",
        },
        {
            email: "siti@student.its.ac.id",
            name: "Siti Aminah",
            role: Role.STUDENT,
            phone: "08122222222",
        },
        {
            email: "joko@student.its.ac.id",
            name: "Joko Widodo",
            role: Role.STUDENT,
            phone: "08122222223",
        },
        // Passengers (Students who book rides)
        {
            email: "ani@student.its.ac.id",
            name: "Ani Yudhoyono",
            role: Role.STUDENT,
            phone: "08133333331",
        },
        {
            email: "rudi@student.its.ac.id",
            name: "Rudi Habibie",
            role: Role.STUDENT,
            phone: "08133333332",
        },
    ];

    // 3. Create Users
    const createdUsersMap: Record<string, string> = {}; // Map email -> ID

    for (const u of fixedUsers) {
        const user = await prisma.user.create({
            data: {
                email: u.email,
                name: u.name,
                password: hashedPassword,
                phone: u.phone,
                role: u.role,
                greenPoints: Math.floor(Math.random() * 500), // Random starting points
            },
        });
        createdUsersMap[u.email] = user.id;
        console.log(`Created user: ${u.email}`);
    }

    // 4. Create Rides (Assigned to specific drivers)
    const ridesToCreate = [
        {
            driverEmail: "budi@student.its.ac.id",
            destination: "Gedung Rektorat ITS",
            pickup: "Asrama Mahasiswa ITS",
            timeOffsetHours: 2, // 2 hours from now
            seats: 3,
            cost: 10000,
        },
        {
            driverEmail: "budi@student.its.ac.id",
            destination: "Galaxy Mall (Nearby)",
            pickup: "Departemen Teknik Informatika ITS",
            timeOffsetHours: 5,
            seats: 2,
            cost: 15000,
        },
        {
            driverEmail: "siti@student.its.ac.id",
            destination: "Departemen Desain Produk Industri ITS",
            pickup: "Kantin Pusat ITS",
            timeOffsetHours: 24, // Tomorrow
            seats: 1,
            cost: 5000,
        },
        {
            driverEmail: "joko@student.its.ac.id",
            destination: "Pakuwon City (Nearby)",
            pickup: "Bundaran ITS",
            timeOffsetHours: 1,
            seats: 4,
            cost: 12000,
        },
    ];

    for (let i = 0; i < 5; i++) {
        const randomDriverEmail = [
            "budi@student.its.ac.id",
            "siti@student.its.ac.id",
            "joko@student.its.ac.id",
        ][Math.floor(Math.random() * 3)];
        ridesToCreate.push({
            driverEmail: randomDriverEmail,
            destination:
                LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            pickup: LOCATIONS[Math.floor(Math.random() * LOCATIONS.length)],
            timeOffsetHours: Math.random() * 48 + 2,
            seats: Math.floor(Math.random() * 3) + 1,
            cost: (Math.floor(Math.random() * 5) + 1) * 2000 + 2000,
        });
    }

    const createdRides = [];

    for (let i = 0; i < ridesToCreate.length; i++) {
        const r = ridesToCreate[i];
        const departureTime = new Date(
            Date.now() + r.timeOffsetHours * 60 * 60 * 1000
        );

        const newRide = await prisma.ride.create({
            data: {
                driverId: createdUsersMap[r.driverEmail],
                destination: r.destination,
                pickupPoint: r.pickup,
                departureTime,
                seatsAvailable: r.seats,
                cost: r.cost,
                status: RideStatus.OPEN,
                passengerIds: [],
                // FIXED: Use LoremFlickr for real car/bike images
                vehiclePhotoUrl: getRandomVehicleImage(i),
                verificationCode: generateOTP(),
                deletedAt: null,
            },
        });
        createdRides.push(newRide);
    }
    console.log(`🚗 Created ${createdRides.length} rides`);

    // 5. Create Bookings (Assign passengers to rides)
    // Let 'ani' book Budi's first ride
    const rideToBook = createdRides[0];
    const passengerId = createdUsersMap["ani@student.its.ac.id"];

    await prisma.ride.update({
        where: { id: rideToBook.id },
        data: {
            passengerIds: { push: passengerId },
            seatsAvailable: { decrement: 1 },
        },
    });
    console.log(
        `🎫 Booked ride for ani@student.its.ac.id on ride ${rideToBook.id}`
    );

    // Let 'rudi' book Siti's ride
    const rideToBook2 = createdRides[2];
    const passengerId2 = createdUsersMap["rudi@student.its.ac.id"];

    await prisma.ride.update({
        where: { id: rideToBook2.id },
        data: {
            passengerIds: { push: passengerId2 },
            seatsAvailable: { decrement: 1 },
        },
    });
    console.log(
        `🎫 Booked ride for rudi@student.its.ac.id on ride ${rideToBook2.id}`
    );

    console.log("✅ Seeding finished.");
    console.log("------------------------------------------------");
    console.log("🔑 Login Credentials (Password: password123):");
    console.log("   - Driver: budi@student.its.ac.id");
    console.log("   - Driver: siti@student.its.ac.id");
    console.log("   - Passenger: ani@student.its.ac.id");
    console.log("   - Passenger: rudi@student.its.ac.id");
    console.log("------------------------------------------------");
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });