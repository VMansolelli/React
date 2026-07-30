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

// Inicia o servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});