import { PrismaClient } from "@prisma/client";
import express from "express";
import cors from "cors";

const prisma = new PrismaClient();
const app = express();

app.use(cors());
app.use(express.json());

app.get("/todos", async (req, res) => {
  const todos = await prisma.todo.findMany();
  res.json(todos);
});

app.post("/todos", async (req, res) => {
  const { userId, title, completed } = req.body;
  const result = await prisma.todo.create({
    data: {
      title,
      completed,
      user: { connect: { id: userId } },
    },
  });
  res.json(result);
});

app.get(`/todos/:id`, async (req, res) => {
  const { id }: { id?: string } = req.params;

  const todo = await prisma.todo.findUnique({
    where: { id: Number(id) },
  });
  res.json(todo);
});

app.delete(`/todos/:id`, async (req, res) => {
  const { id } = req.params;
  const todo = await prisma.todo.delete({
    where: {
      id: Number(id),
    },
  });
  res.json(todo);
});

app.patch("/todos/:id", async (req, res) => {
  const { id } = req.params;
  const { userId, title, completed } = req.body;

  try {
    const todo = await prisma.todo.update({
      where: { id: Number(id) },
      data: {
        id: Number(id),
        userId,
        title,
        completed,
      },
    });

    res.json(todo);
  } catch (error) {
    res.json({ error: `Post with ID ${id} does not exist in the database` });
  }
});

app.post(`/signup`, async (req, res) => {
  const { name, email } = req.body;

  const user = await prisma.user.create({
    data: {
      name,
      email,
    },
  });
  res.json(user);
});

const server = app.listen(4000, () =>
  console.log(`
🚀 Server ready at: http://localhost:4000`)
);
