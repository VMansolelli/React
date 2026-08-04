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

  async function cadastrarContato(event: React.FormEvent<HTMLFormElement>) {
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

  return (
    <div className="mx-auto max-w-2xl p-6">
      <h1 className="mb-6 text-center text-3xl font-bold">Lista de Contatos</h1>
      {erro && (
        <div className="mb-6 rounded-lg bg-red-100 p-4 text-red-700">
          {erro}
        </div>
      )}
      <form
        onSubmit={editando ? atualizarContato : cadastrarContato}
        className="mb-6 space-y-4"
      >
        <input
          type="text"
          placeholder="Nome"
          value={form.name}
          onChange={(event) =>
            setForm({
              ...form,
              name: event.target.value,
            })
          }
          className="w-full rounded border p-2"
          required
        />
        <input
          type="email"
          placeholder="E-mail"
          value={form.email}
          onChange={(event) =>
            setForm({
              ...form,
              email: event.target.value,
            })
          }
          className="w-full rounded border p-2"
          required
        />
        <div className="flex gap-2">
          <button
            type="submit"
            className={`rounded-lg px-5 py-2 text-white ${
              editando
                ? "bg-green-500 hover:bg-green-700"
                : "bg-blue-500 hover:bg-blue-700"
            }`}
          >
            {editando ? "Atualizar" : "Cadastrar"}
          </button>
          {editando && (
            <button
              type="button"
              onClick={cancelarEdicao}
              className="rounded-lg bg-gray-500 px-5 py-2 text-white hover:bg-gray-600"
            >
              Cancelar
            </button>
          )}
        </div>
      </form>

      {contatos.length === 0 ? (
        <p className="text-center text-gray-500">Nenhum contato encontrado.</p>
      ) : (
        <ul className="space-y-4">
          {contatos.map((contato) => (
            <li
              key={contato.id}
              className="rounded-lg border p-4 shadow-sm transition hover:shadow-md"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-semibold"> {contato.name} </h2>
                  <p className="text-gray-600"> {contato.email} </p>
                </div>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => editarContato(contato)}
                    className="rounded-lg bg-yellow-500 px-4 py-2 text-white hover:bg-yellow-600"
                  >
                    Editar
                  </button>
                  <button
                    type="button"
                    onClick={() => deletarContato(contato.id)}
                    className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                  >
                    Excluir
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
