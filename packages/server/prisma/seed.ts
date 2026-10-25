import { PrismaMariaDb } from '@prisma/adapter-mariadb';
import { PrismaClient } from '../generated/prisma/client';

const adapter = new PrismaMariaDb({
   host: process.env.DATABASE_HOST,
   port: Number(process.env.DATABASE_PORT) || 3306,
   user: process.env.DATABASE_USER,
   password: process.env.DATABASE_PASSWORD,
   database: process.env.DATABASE_NAME,
   connectionLimit: 5,
});
const prisma = new PrismaClient({ adapter });

type SeedReview = { author: string; rating: number; content: string };
type SeedProduct = {
   id: number;
   name: string;
   description: string;
   price: number;
   reviews: SeedReview[];
};

const products: SeedProduct[] = [
   {
      id: 1,
      name: 'Aurora Wireless Headphones',
      description:
         'Over-ear Bluetooth headphones with active noise cancelling.',
      price: 149.99,
      reviews: [
         {
            author: 'Maya',
            rating: 5,
            content:
               'Noise cancelling is superb on flights. Battery lasts all week.',
         },
         {
            author: 'Leo',
            rating: 4,
            content:
               'Great sound, but the ear cups get warm after a couple of hours.',
         },
         {
            author: 'Priya',
            rating: 3,
            content: 'Good audio quality, though the companion app is clunky.',
         },
      ],
   },
   {
      id: 2,
      name: 'Summit Trail Backpack',
      description: '30L hiking backpack with rain cover and hydration sleeve.',
      price: 89.0,
      reviews: [
         {
            author: 'Sam',
            rating: 5,
            content:
               'Carried it on a 3-day trek. Comfortable straps, plenty of pockets.',
         },
         {
            author: 'Ana',
            rating: 4,
            content:
               'Rain cover saved my gear. Wish the hip belt was a bit wider.',
         },
      ],
   },
   {
      id: 3,
      name: 'BrewMaster Pour-Over Kit',
      description: 'Glass dripper, gooseneck kettle and reusable steel filter.',
      price: 59.5,
      reviews: [
         {
            author: 'Oliver',
            rating: 5,
            content: 'Makes the cleanest cup of coffee I have had at home.',
         },
         {
            author: 'Zara',
            rating: 2,
            content:
               'Kettle handle got hot and the filter clogs with fine grinds.',
         },
      ],
   },
   {
      // The Reviews page (packages/client/src/pages/ReviewsPage.tsx) shows product 4.
      id: 4,
      name: 'Nimbus Smart Watch',
      description:
         'Fitness smartwatch with heart-rate, sleep tracking, GPS and a 7-day battery.',
      price: 199.0,
      reviews: [
         {
            author: 'Arjun',
            rating: 5,
            content:
               'Battery easily lasts a week and the sleep tracking is surprisingly accurate. Love it.',
         },
         {
            author: 'Emily',
            rating: 4,
            content:
               'GPS locks on quickly for runs. The strap is comfortable, but the screen is hard to read in direct sunlight.',
         },
         {
            author: 'Carlos',
            rating: 2,
            content:
               'Notifications from my phone arrive late or not at all. Support took a week to reply.',
         },
         {
            author: 'Hana',
            rating: 5,
            content:
               'Heart-rate readings match my chest strap. Great value compared to bigger brands.',
         },
         {
            author: 'Noah',
            rating: 3,
            content:
               'Solid fitness features, but the companion app crashes now and then.',
         },
         {
            author: 'Fatima',
            rating: 4,
            content:
               'Lightweight and stylish enough to wear to work. Charging cable is too short.',
         },
         {
            author: 'Liam',
            rating: 1,
            content:
               'Stopped syncing after two weeks and a factory reset did not help.',
         },
         {
            author: 'Sofia',
            rating: 5,
            content:
               'The workout auto-detection is brilliant. It recognised my swims and cycling without any setup.',
         },
      ],
   },
];

async function main() {
   const ids = products.map((p) => p.id);

   // Re-runnable: clear old seed reviews/summaries for these products first.
   await prisma.summary.deleteMany({ where: { productId: { in: ids } } });
   await prisma.review.deleteMany({ where: { productId: { in: ids } } });

   for (const { reviews, ...product } of products) {
      await prisma.product.upsert({
         where: { id: product.id },
         create: product,
         update: product,
      });
      await prisma.review.createMany({
         data: reviews.map((r) => ({ ...r, productId: product.id })),
      });
   }

   const total = products.reduce((n, p) => n + p.reviews.length, 0);
   console.log(`Seeded ${products.length} products and ${total} reviews.`);
}

main()
   .catch((err) => {
      console.error('Seeding failed:', err);
      process.exit(1);
   })
   .finally(() => prisma.$disconnect());
