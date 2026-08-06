import express, { type Express, type Request, type Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import { prisma } from "./prisma";

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app: Express = express();
app.use(morgan("dev")); // Log de requisições HTTP
app.use(helmet()); // Adiciona cabeçalhos de segurança

app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json());

const port = process.env.PORT || 3000;

// Rota raiz para verificar se o servidor está funcionando
app.get("/", (req: Request, res: Response) => {
  res.send("Hello World!");
});

// Rota GET para retornar a lista de contatos
app.get("/api/contatos", async (req: Request, res: Response) => {
  try {
    const contatos = await prisma.contato.findMany();
    res.json(contatos);
  } catch (error) {
    console.error("Erro ao buscar contatos:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota POST para adicionar um novo contato
app.post("/api/contatos", async (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: "Nome e email são obrigatórios" });
  }

  try {
    const novoContato = await prisma.contato.create({
      data: { name, email },
    });
    res.status(201).json(novoContato);
  } catch (error) {
    console.error("Erro ao criar contato:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Rota PUT para atualizar um contato existente
app.put("/api/contatos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  try {
    const contato = await prisma.contato.findUnique({
      where: { id },
    });
    if (!contato) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    const contatoAtualizado = await prisma.contato.update({
      where: { id },
      data: { name: name ?? contato.name, email: email ?? contato.email },
    });

    res.json(contatoAtualizado);
  } catch (error) {
    console.error("Erro ao atualizar contato:", error);
    res.status(500).json({ error: "Erro interno do servidor" });
  }
});

//rota DELETE para remover um contato existente
app.delete("/api/contatos/:id", async (req: Request, res: Response) => {
  const id = Number(req.params.id);
  
  try {
    const contato = await prisma.contato.findUnique({
      where: { id },
    });
    if (!contato) {
      return res.status(404).json({ error: "Contato não encontrado" });
    }

    await prisma.contato.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (error) {
    console.error("Erro ao remover contato:", error);
    return res.status(500).json({ error: "Erro interno do servidor" });
  }
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
