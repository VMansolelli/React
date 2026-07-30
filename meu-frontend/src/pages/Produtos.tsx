import { useState } from "react";

type Usuario = {
  id: number;
  name: string;
  email: string;
};

function Produtos() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [idEdicao, setIdEdicao] = useState<number | null>(null);

  async function buscarUsuarios() {
    const resposta = await fetch(
      `https://jsonplaceholder.typicode.com/users?name_like=${nome}`,
    );
    const dados = await resposta.json();
    const resultado = dados.filter((usuario: Usuario) =>
      usuario.name.toLowerCase().includes(nome.toLowerCase()),
    );
    setUsuarios(resultado);
  }

  function cadastrarUsuario() {
    const novoUsuario: Usuario = {
      id: Date.now(),
      name: nome,
      email: email,
    };
    setUsuarios([...usuarios, novoUsuario]);

    setNome("");
    setEmail("");
  }

  function excluirUsuario(id: number) {
    const usuariosAtualizados = usuarios.filter((usuario) => usuario.id !== id);
    setUsuarios(usuariosAtualizados);
  }

  function editarUsuario(id: number) {
    const usuario = usuarios.find((usuario) => usuario.id === id);

    if (usuario) {
      setNome(usuario.name);
      setEmail(usuario.email);
      setIdEdicao(id);
    }
  }

  function salvarEdicao() {
    setUsuarios(
      usuarios.map((usuario) => {
        if (usuario.id === idEdicao) {
          return {
            ...usuario,
            name: nome,
            email: email,
          };
        }

        return usuario;
      }),
    );

    setIdEdicao(null);
    setNome("");
    setEmail("");
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Pesquisar Usuários</h1>

      <div className="mb-8 space-y-4">
        <input
          type="text"
          value={nome}
          placeholder="Digite parte do nome..."
          className="w-full rounded border p-2"
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          value={email}
          placeholder="Digite o email..."
          className="w-full rounded border p-2"
          onChange={(e) => setEmail(e.target.value)}
        />
        <div className="flex gap-4">
          <button
            className="flex-1 rounded bg-blue-500 px-4 py-2 text-white"
            onClick={buscarUsuarios}
          >
            Buscar Usuários
          </button>
          <button
            onClick={idEdicao === null ? cadastrarUsuario : salvarEdicao}
            className={`flex-1 rounded px-4 py-2 text-white ${
              idEdicao === null
                ? "bg-green-600 hover:bg-green-700"
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {idEdicao === null ? "Cadastrar" : "Salvar"}
          </button>
        </div>
        <div className="mt-8 space-y-4">
          {usuarios.length === 0 ? (
            <p className="text-gray-500">Nenhum usuário encontrado.</p>
          ) : (
            usuarios.map((usuario) => (
              <div key={usuario.id} className="rounded border p-4">
                <h2 className="text-xl font-bold">{usuario.name}</h2>
                <p className="text-gray-600">{usuario.email}</p>
                <div className="mt-2 flex gap-2">
                  <button
                    className="rounded bg-yellow-500 px-4 py-2 text-white"
                    onClick={() => editarUsuario(usuario.id)}
                  >
                    Editar
                  </button>
                  <button
                    className="rounded bg-red-500 px-4 py-2 text-white"
                    onClick={() => excluirUsuario(usuario.id)}
                  >
                    Excluir
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
}

export default Produtos;
