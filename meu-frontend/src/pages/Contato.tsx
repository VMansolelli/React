import { useEffect, useState } from "react";

interface Contato {
  id: number;
  name: string;
  email: string;
}

const API_URL = "http://localhost:3000/api/contatos";

export default function Contatos() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({ id: 0, name: "", email: "" });

  async function buscarContatos() {
    try {
      const resposta = await fetch(API_URL);

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

  async function deletarContato(id: number) {
    try {
      setErro("");
      const resposta = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });
      if (!resposta.ok) {
        throw new Error("Erro ao deletar contato.");
      }
      await buscarContatos();
    } catch (err) {
      const mensagem =
        err instanceof Error ? err.message : "Erro desconhecido.";
      setErro(mensagem);
    }
  }

  async function cadastrarContato(event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();
    try {
      setErro("");
      const resposta = await fetch(API_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: form.name, email: form.email }),
      });
      if (!resposta.ok) {
        throw new Error("Erro ao cadastrar contato.");
      }
      await buscarContatos();
      cancelarEdicao();
    } catch (err) {
      const mensagem =
        err instanceof Error ? err.message : "Erro desconhecido.";
      setErro(mensagem);
    }
  }

  async function atualizarContato(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    try {
      setErro("");
      const resposta = await fetch(`${API_URL}/${form.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name: form.name, email: form.email }),
      });
      if (!resposta.ok) {
        throw new Error("Erro ao atualizar contato.");
      }
      await buscarContatos();
      cancelarEdicao();
    } catch (err) {
      const mensagem =
        err instanceof Error ? err.message : "Erro desconhecido.";
      setErro(mensagem);
    }
  }

  function editarContato(contato: Contato) {
    setForm({ id: contato.id, name: contato.name, email: contato.email });
    setEditando(true);
    setErro("");
  }

  function cancelarEdicao() {
    setForm({ id: 0, name: "", email: "" });
    setEditando(false);
    setErro("");
  }

  useEffect(() => {
    let ativo = true;

    async function carregarContatos() {
      try {
        setCarregando(true);
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
          throw new Error("Erro ao buscar contatos.");
        }
        const dados = await resposta.json();
        if (ativo) {
          setContatos(dados);
        }
      } catch (err) {
        if (ativo) {
          setErro((err as Error).message);
        }
      } finally {
        if (ativo) {
          setCarregando(false);
        }
      }
    }
    void carregarContatos();

    return () => {
      ativo = false;
    };
  }, []);

  if (carregando) {
    return (
      <div className="mt-10 flex justify-center">
        <p className="text-gray-600">Carregando contatos...</p>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="mx-auto mt-10 max-w-md rounded-lg bg-red-100 p-4 text-red-700">
        {erro}
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Lista de Contatos</h1>

      {contatos.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum contato encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {contatos.map((contato) => (
            <li
              key={contato.id}
              className="rounded-lg border p-4 shadow-sm transition hover:shadow-md"
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