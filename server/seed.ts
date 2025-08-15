import mongoose from './db';
import User from './models/userModel';
import Quest from './models/questModel';
import { faker } from '@faker-js/faker';
import bcrypt from 'bcryptjs';

// Deterministic so all teammates get the same data
faker.seed(20250811);

// Flags
const CLEAN = process.argv.includes('--clean'); // drop User & Quest before seeding

// Config
const USER_COUNT = 15;   // at least 2 without profilePicture
const QUEST_COUNT = 100; // mix of event/place/activity

// Frontend should serve from /public/profile-pics/*.jpg
const PROFILE_PICS = [
  '/profile-pics/profile-pic-1.jpg',
  '/profile-pics/profile-pic-2.jpg',
  '/profile-pics/profile-pic-3.jpg',
  '/profile-pics/profile-pic-4.jpg',
  '/profile-pics/profile-pic-5.jpg',
  '/profile-pics/profile-pic-6.jpg',
  '/profile-pics/profile-pic-7.jpg',
  '/profile-pics/profile-pic-8.jpg',
  '/profile-pics/profile-pic-9.jpg',
  '/profile-pics/profile-pic-10.jpg',
];

// Target clusters with simple local-time offsets (summer time assumed)
const CLUSTERS: Record<string, { lon: number; lat: number; tzOffset: number }> = {
  brussels:     { lon: 4.3517,  lat: 50.8503, tzOffset: 2 }, // CEST
  southampton:  { lon: -1.4043, lat: 50.9097, tzOffset: 1 }, // BST
  shropshire:   { lon: -2.7160, lat: 52.7063, tzOffset: 1 }, // BST
  durres:       { lon: 19.4462, lat: 41.3231, tzOffset: 2 }, // CEST
};

const CLUSTER_KEYS = Object.keys(CLUSTERS);
const QUEST_TYPES: Array<'event' | 'place' | 'activity'> = ['event', 'place', 'activity'];

function jitterCoord(base: number, spread = 0.02) {
  return base + faker.number.float({ min: -spread, max: spread });
}

function makeLocalEventWindow(tzOffset: number) {
  // Pick a date within 30 days
  const d = faker.date.soon({ days: 30 });

  // Local start 09:00–17:00, end ≤ 21:00
  const localStartHour = faker.number.int({ min: 9, max: 17 });
  const durationHours = faker.number.int({ min: 1, max: 4 });
  const localEndHour = Math.min(localStartHour + durationHours, 21);

  // Convert local to UTC by subtracting tzOffset
  const start = new Date(Date.UTC(
    d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), localStartHour - tzOffset, 0, 0, 0
  ));
  const end = new Date(Date.UTC(
    d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate(), localEndHour - tzOffset, 0, 0, 0
  ));
  return { start, end };
}

async function run() {
  try {
    if (CLEAN) {
      await Promise.all([User.deleteMany({}), Quest.deleteMany({})]);
      console.log('Cleaned User and Quest collections.');
    }

    // ---- Users ----
    const users = Array.from({ length: USER_COUNT }).map((_, i) => {
      const hasPic = i < USER_COUNT - 2; // last 2 users without a profile picture
      return {
        username: `seed_user_${String(i + 1).padStart(2, '0')}`,
        email: `seed_user_${String(i + 1).padStart(2, '0')}@example.com`,
        password: 'Test@1234', // Upper+lower+number+symbol, length 9
        firstName: faker.person.firstName(),
        lastName: faker.person.lastName(),
        birthday: faker.date.birthdate({ min: 18, max: 50, mode: 'age' }),
        isCurrent: false,
        following: [],
        followers: [],
        profilePicture: hasPic ? faker.helpers.arrayElement(PROFILE_PICS) : undefined,
        myQuests: [],
        myLocations: [],
      } as any;
    });

    await User.insertMany(users);
    console.log(`Inserted ${users.length} users.`);

    // ---- Quests ----
    const quests: any[] = [];
    for (let i = 0; i < QUEST_COUNT; i++) {
      const key = faker.helpers.arrayElement(CLUSTER_KEYS);
      const { lon, lat, tzOffset } = CLUSTERS[key];
      const qType = faker.helpers.arrayElement(QUEST_TYPES);

      const qLon = jitterCoord(lon);
      const qLat = jitterCoord(lat);

      let startAt: Date | undefined;
      let endAt: Date | undefined;
      if (qType === 'event') {
        const w = makeLocalEventWindow(tzOffset);
        startAt = w.start;
        endAt = w.end;
      }

      quests.push({
        name: `quest-${i + 1}`,
        type: qType,
        // Matches your current nested LocationSchema:
        // location: { location: { type: 'Point', coordinates: [lon, lat] } }
      location: {
          type: 'Point',
          coordinates: [qLon, qLat],
        },
        ageRestricted: faker.datatype.boolean({ probability: 0.2 }),
        price: faker.helpers.arrayElement([0, faker.number.int({ min: 5, max: 75 })]),
        currency: faker.helpers.arrayElement(['GBP', 'EUR']),
        url: faker.internet.url(),
        startAt,
        endAt,
        description: faker.lorem.sentences(2),
        source: 'mock',
        sourceId: faker.string.uuid(),
      });
    }

    await Quest.insertMany(quests);
    console.log(`Inserted ${quests.length} quests.`);

    await mongoose.disconnect();
    console.log('Seeding complete.');
  } catch (err) {
    console.error('Seeding failed:', err);
    await mongoose.disconnect();
    process.exit(1);
  }
}

run();