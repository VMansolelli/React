import { useEffect, useState } from "react";

interface Contato {
  id: number;
  name: string;
  email: string;
}

const API_URL = "http://localhost:3000/api/contatos";

export default function Contato() {
  const [contatos, setContatos] = useState<Contato[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [editando, setEditando] = useState(false);
  const [form, setForm] = useState({
    id: 0,
    name: "",
    email: "",
  });

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

  async function cadastrarContato() {
    const resposta = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (!resposta.ok) {
      throw new Error("Erro ao cadastrar contato.");
    }
    await buscarContatos();
    cancelarEdicao();
  }

  async function atualizarContato() {
    const resposta = await fetch(`${API_URL}/${form.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });
    if (!resposta.ok) {
      throw new Error("Erro ao atualizar contato.");
    }
    await buscarContatos();
    cancelarEdicao();
  }

  async function deletarContato(id: number) {
    const resposta = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });
    if (!resposta.ok) {
      throw new Error("Erro ao deletar contato.");
    }
    await buscarContatos();
  }

  function editarContato(contato: Contato) {
    setForm(contato);
    setEditando(true);
  }

  function cancelarEdicao() {
    setForm({ id: 0, name: "", email: "" });
    setEditando(false);
  }



  useEffect(() => {
    let ativo = true;

    const carregar = async () => {
      try {
        setCarregando(true);
        const resposta = await fetch(API_URL);
        if (!resposta.ok) {
          throw new Error("Erro ao buscar contatos");
        }
        const dados = await resposta.json();
        if (ativo) {
          setContatos(dados);
          setErro("");
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
    };
    void carregar();

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
