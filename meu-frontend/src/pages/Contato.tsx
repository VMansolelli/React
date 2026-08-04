import { useEffect, useState } from "react";

interface Contato {
  id: number;
  name: string;
  email: string;
}

function Contato() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function buscarContatos() {
      try {
        const resposta = await fetch("http://localhost:3000/api/contatos");

        if (!resposta.ok) {
          throw new Error("Erro ao buscar contatos.");
        }

        const dados = await resposta.json();
        setContatos(dados);
      } catch (err) {
        setErro((err as Error).message);
      } finally {
        setCarregando(false);
      }
    }

    buscarContatos();
  }, []);

  if (carregando) {
    return (
      <div className="flex justify-center mt-10">
        <p className="text-gray-600">Carregando contatos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="max-w-md mx-auto mt-10 bg-red-100 text-red-700 p-4 rounded-lg">
        {erro}
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">
        Lista de Contatos
      </h1>

      {contatos.length === 0 ? (
        <p className="text-center text-gray-500">
          Nenhum contato encontrado.
        </p>
      ) : (
        <ul className="space-y-4">
          {contatos.map((contato) => (
            <li
              key={contato.id}
              className="border rounded-lg p-4 shadow-sm hover:shadow-md transition"
            >
              <h2 className="text-lg font-semibold">{contato.name}</h2>
              <p className="text-gray-600">{contato.email}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Contato;