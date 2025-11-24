import { Response } from 'express';
import { prisma } from '../config/db';
import { AuthRequest } from '../middlewares/auth.middleware';
import { generateOTP } from '../utils/otpGenerator';
import { env } from '../config/env';

// 1. Create Ride (With Image)
export const createRide = async (req: AuthRequest, res: Response) => {
  try {
    const { destination, pickupPoint, departureTime, seatsAvailable, cost } = req.body;
    const driverId = req.user!.id;
    
    if (!req.file) return res.status(400).json({ message: 'Vehicle photo is required' });

    // Construct Full Image URL
    const vehiclePhotoUrl = `${req.protocol}://${req.get('host')}/${env.UPLOAD_DIR}/${req.file.filename}`;

    const ride = await prisma.ride.create({
      data: {
        driverId,
        destination,
        pickupPoint,
        departureTime: new Date(departureTime),
        seatsAvailable: Number(seatsAvailable),
        cost: Number(cost),
        vehiclePhotoUrl,
        verificationCode: generateOTP(), // Auto-generate secret code
        status: 'OPEN',
      },
    });

    res.status(201).json(ride);
  } catch (error) {
    res.status(500).json({ message: 'Error creating ride', error });
  }
};

// 2. Get All Rides (Filter: Open & Future)
export const getRides = async (req: AuthRequest, res: Response) => {
  try {
    const { destination } = req.query;

    const whereClause: any = {
      status: 'OPEN',
      departureTime: { gte: new Date() }, // Only future rides
    };

    if (destination) {
      whereClause.destination = { contains: String(destination), mode: 'insensitive' };
    }

    const rides = await prisma.ride.findMany({
      where: whereClause,
      include: { driver: { select: { name: true, greenPoints: true, phone: true } } },
      orderBy: { departureTime: 'asc' },
    });

    // Security: Remove verificationCode before sending to public
    const sanitizedRides = rides.map(ride => {
      const { verificationCode, ...safeRide } = ride;
      return safeRide;
    });

    res.json(sanitizedRides);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching rides', error });
  }
};

// 3. Book a Seat
export const bookRide = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const passengerId = req.user!.id;

    // Atomic Update: Decrement seats, Add passenger
    const ride = await prisma.ride.update({
      where: { id, seatsAvailable: { gt: 0 } }, // Ensure seats > 0
      data: {
        seatsAvailable: { increment: -1 },
        passengerIds: { push: passengerId },
      },
    });

    // Return the ride (The passenger needs to see the verificationCode now!)
    // In a real app, we would filter this, but for the assignment, returning the ride is fine 
    // OR we send the code specifically in the response body.
    res.json({ message: 'Booked successfully', ticketCode: ride.verificationCode });
  } catch (error) {
    res.status(400).json({ message: 'Ride full or unavailable' });
  }
};

// 4. Verify & Complete (The Green Point Logic)
export const verifyRide = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { code } = req.body; // Code input by Driver
    const driverId = req.user!.id;

    const ride = await prisma.ride.findUnique({ where: { id } });

    if (!ride) return res.status(404).json({ message: 'Ride not found' });
    if (ride.driverId !== driverId) return res.status(403).json({ message: 'Only driver can verify' });
    if (ride.verificationCode !== code) return res.status(400).json({ message: 'Invalid OTP Code' });

    // Transaction: Update Status + Add Points to Driver & Passengers
    await prisma.$transaction([
      // 1. Close Ride
      prisma.ride.update({
        where: { id },
        data: { status: 'COMPLETED' },
      }),
      // 2. Reward Driver (+15)
      prisma.user.update({
        where: { id: driverId },
        data: { greenPoints: { increment: 15 } },
      }),
      // 3. Reward All Passengers (+5)
      prisma.user.updateMany({
        where: { id: { in: ride.passengerIds } },
        data: { greenPoints: { increment: 5 } },
      }),
    ]);

    res.json({ message: 'Ride verified! Green Points distributed.' });
  } catch (error) {
    res.status(500).json({ message: 'Verification failed', error });
  }
};