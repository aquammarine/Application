import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    const userCount = await prisma.user.count();
    if (userCount > 0) {
        console.log('Database already has data, skipping seed.');
        return;
    }

    console.log('Seeding database...');

    const hashedPassword = await bcrypt.hash('password123', 10);

    const user1 = await prisma.user.create({
        data: {
            email: 'organizer@example.com',
            password: hashedPassword,
            firstName: 'John',
            lastName: 'Organizer',
        },
    });

    const user2 = await prisma.user.create({
        data: {
            email: 'participant@example.com',
            password: hashedPassword,
            firstName: 'Jane',
            lastName: 'Participant',
        },
    });

    console.log('Created users:', { user1: user1.email, user2: user2.email });

    const now = new Date();

    const event1 = await prisma.event.create({
        data: {
            title: 'Tech Conference 2026',
            description: 'A grand conference about the future of AI and Web development.',
            dateTime: new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000),
            location: 'Silicon Valley Convention Center',
            capacity: 500,
            isPublic: true,
            organizerId: user1.id,
        },
    });

    const event2 = await prisma.event.create({
        data: {
            title: 'React Workshop',
            description: 'Hands-on workshop for building premium React applications.',
            dateTime: new Date(now.getTime() + 14 * 24 * 60 * 60 * 1000),
            location: 'Online',
            capacity: 50,
            isPublic: true,
            organizerId: user1.id,
        },
    });

    const event3 = await prisma.event.create({
        data: {
            title: 'Networking Brunch',
            description: 'Meet and greet with local developers and designers.',
            dateTime: new Date(now.getTime() + 21 * 24 * 60 * 60 * 1000),
            location: 'The Coffee House, Downtown',
            capacity: 30,
            isPublic: true,
            organizerId: user1.id,
        },
    });

    console.log('Created events:', [event1.title, event2.title, event3.title]);

    await prisma.participant.create({
        data: {
            userId: user2.id,
            eventId: event1.id,
        },
    });

    await prisma.participant.create({
        data: {
            userId: user2.id,
            eventId: event2.id,
        },
    });

    console.log('Database seeding completed successfully.');
}

main()
    .catch((e) => {
        console.error(e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
