import { PrismaClient, Prisma } from "@prisma/client";

const prisma = new PrismaClient();

const userData: Prisma.UserCreateInput[] = [
  {
    name: "Saheb",
    email: "saheb@hooli.com",
    todos: {
      create: [
        {
          title: "Move with Lil to the black mountain hills of Dakota",
          completed: false,
        },
        { title: "Lose Lil to Danny", completed: true },
        { title: "Get hit in the eye by Danny", completed: false },
        { title: "Walk into town seeking revenge", completed: false },
        { title: "Book room at local saloon", completed: false },
        { title: "Check into room and read Gideon's bible", completed: true },
        { title: "Drink too much gin", completed: false },
        {
          title: "Overhear Lil and Danny in neighboring room",
          completed: false,
        },
        {
          title: "Burst into neighboring room and declare a showdown",
          completed: false,
        },
        { title: "Get shot by Danny and collapse in corner", completed: false },
        { title: "Visit doctor", completed: false },
        { title: "Return to room and read Gideon's bible", completed: false },
        {
          title: "Sing along! D'do d'do d'do do do d'do d'do d'do",
          completed: false,
        },
      ],
    },
  },
  {
    name: "richard",
    email: "richard@piedpier.com",
    todos: {
      create: [
        {
          title: "Sing along! D'do d'do d'do do do d'do d'do d'do",
          completed: false,
        },
      ],
    },
  },
];

async function main() {
  console.log(`Start seeding ...`);
  for (const u of userData) {
    const user = await prisma.user.create({
      data: u,
    });
    console.log(`Created user with id: ${user.id}`);
  }
  console.log(`Seeding finished.`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
