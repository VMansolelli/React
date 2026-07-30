import express, { type Express, type Request, type Response } from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config(); // Carrega as variáveis de ambiente do arquivo .env

const app: Express = express();
app.use(morgan('dev')); // Log de requisições HTTP
app.use(helmet()); // Adiciona cabeçalhos de segurança

app.use(cors()); // Habilita o CORS para todas as rotas
app.use(express.json());

const port = process.env.PORT || 3000;

// Dados em memória para simular um banco de dados
const contatos = [
  { id: 1, name: 'Jão', email: 'joao@example.com' },
  { id: 2, name: 'Maria', email: 'maria@example.com' },
  { id: 3, name: 'Pedro', email: 'pedro@example.com' }
];

// Rota raiz para verificar se o servidor está funcionando
app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});

// Rota GET para retornar a lista de contatos
app.get('/api/contatos', (req: Request, res: Response) => {
  res.json(contatos);
});

// Rota POST para adicionar um novo contato
app.post('/api/contatos', (req: Request, res: Response) => {
  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ error: 'Nome e email são obrigatórios' });
  }

  const novoId = contatos.length > 0 ? Math.max(...contatos.map(c => c.id)) + 1 : 1;
  const novoContato = { id: novoId, name, email };
  contatos.push(novoContato);

  return res.status(201).json(novoContato);
});

// Rota PUT para atualizar um contato existente
app.put('/api/contatos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const { name, email } = req.body;

  const index = contatos.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Contato não encontrado' });
  }

  contatos[index] = { ...contatos[index], name: name ?? contatos[index].name, email: email ?? contatos[index].email };

  return res.json(contatos[index]);
});

//rota DELETE para remover um contato existente
app.delete('/api/contatos/:id', (req: Request, res: Response) => {
  const id = Number(req.params.id);
  const index = contatos.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Contato não encontrado' });
  }

  contatos.splice(index, 1);
  return res.status(204).send();
});

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});