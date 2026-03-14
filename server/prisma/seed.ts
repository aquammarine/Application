import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import * as bcrypt from 'bcryptjs';
import * as dotenv from 'dotenv';
import { ONE_WEEK } from '../src/common/constants/time.constants';

dotenv.config();

const pool = new pg.Pool({
    connectionString: process.env.DATABASE_URL,
});
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
    console.log('Starting seed process...');

    const tagsToSeed = [
        { name: 'Tech', nameLower: 'tech', colorHex: '#3B82F6' },
        { name: 'Art', nameLower: 'art', colorHex: '#EC4899' },
        { name: 'Business', nameLower: 'business', colorHex: '#10B981' },
        { name: 'Music', nameLower: 'music', colorHex: '#8B5CF6' },
        { name: 'Sports', nameLower: 'sports', colorHex: '#F59E0B' },
        { name: 'Health', nameLower: 'health', colorHex: '#EF4444' },
        { name: 'Education', nameLower: 'education', colorHex: '#06B6D4' },
        { name: 'Food', nameLower: 'food', colorHex: '#F97316' },
    ];

    const tagsMap: Record<string, string> = {};

    for (const tag of tagsToSeed) {
        const upserted = await prisma.tag.upsert({
            where: { nameLower: tag.nameLower },
            update: { colorHex: tag.colorHex },
            create: tag,
        });
        tagsMap[tag.nameLower] = upserted.id;
    }

    console.log(`Upserted ${Object.keys(tagsMap).length} tags`);

    const userCount = await prisma.user.count();
    let event1Id: string | undefined;
    let event2Id: string | undefined;
    let event3Id: string | undefined;
    let event4Id: string | undefined;

    if (userCount === 0) {
        console.log('Seeding users and events...');
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
                title: 'Tech Meetup 2025',
                description: 'A grand meetup about the future of AI and Web development.',
                dateTime: new Date(now.getTime() + ONE_WEEK),
                location: 'Silicon Valley Convention Center',
                capacity: 500,
                isPublic: true,
                organizerId: user1.id,
            },
        });

        const event2 = await prisma.event.create({
            data: {
                title: 'Design Sprint Workshop',
                description: 'Hands-on workshop for building premium products.',
                dateTime: new Date(now.getTime() + 2 * ONE_WEEK),
                location: 'Online',
                capacity: 50,
                isPublic: true,
                organizerId: user1.id,
            },
        });

        const event3 = await prisma.event.create({
            data: {
                title: 'Startup Pitch Night',
                description: 'Meet and greet with local developers and investors.',
                dateTime: new Date(now.getTime() + 3 * ONE_WEEK),
                location: 'The Coffee House, Downtown',
                capacity: 30,
                isPublic: true,
                organizerId: user1.id,
            },
        });

        const event4 = await prisma.event.create({
            data: {
                title: 'React Deep Dive',
                description: 'Deep dive into React 19 and advanced patterns.',
                dateTime: new Date(now.getTime() + 4 * ONE_WEEK),
                location: 'Tech Hub, Uptown',
                capacity: 100,
                isPublic: true,
                organizerId: user1.id,
            },
        });

        event1Id = event1.id;
        event2Id = event2.id;
        event3Id = event3.id;
        event4Id = event4.id;
        console.log('Created events:', [event1.title, event2.title, event3.title, event4.title]);

        await prisma.participant.createMany({
            data: [
                { userId: user2.id, eventId: event1Id },
                { userId: user2.id, eventId: event2Id },
                { userId: user2.id, eventId: event3Id },
                { userId: user2.id, eventId: event4Id },
            ],
        });
    } else {
        console.log('Users already exist, skipping core data seed but will sync tags.');
        const events = await prisma.event.findMany();
        event1Id = events.find(e => e.title === 'Tech Meetup 2025')?.id;
        event2Id = events.find(e => e.title === 'Design Sprint Workshop')?.id;
        event3Id = events.find(e => e.title === 'Startup Pitch Night')?.id;
        event4Id = events.find(e => e.title === 'React Deep Dive')?.id;
    }

    // ── 3. Link Tags to Events ──────────────────────────────────────
    const tagAssociations: { eventId: string; tagId: string; position: number }[] = [];
    if (event1Id) {
        tagAssociations.push(
            { eventId: event1Id, tagId: tagsMap['tech'], position: 1 },
            { eventId: event1Id, tagId: tagsMap['business'], position: 2 },
        );
    }
    if (event2Id) {
        tagAssociations.push(
            { eventId: event2Id, tagId: tagsMap['art'], position: 1 },
            { eventId: event2Id, tagId: tagsMap['education'], position: 2 },
        );
    }
    if (event3Id) {
        tagAssociations.push(
            { eventId: event3Id, tagId: tagsMap['business'], position: 1 },
            { eventId: event3Id, tagId: tagsMap['tech'], position: 2 },
        );
    }
    if (event4Id) {
        tagAssociations.push(
            { eventId: event4Id, tagId: tagsMap['tech'], position: 1 },
            { eventId: event4Id, tagId: tagsMap['education'], position: 2 },
        );
    }

    if (tagAssociations.length > 0) {
        await prisma.eventTag.createMany({
            data: tagAssociations,
            skipDuplicates: true,
        });
        console.log('Linked tags to events');
    }

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
