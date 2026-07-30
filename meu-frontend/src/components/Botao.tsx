type BotaoProps = {
  texto: string;
};

function Botao({ texto }: BotaoProps) {
  return (
    <button className="rounded-lg bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
      {texto}
    </button>
  );
}

export default Botao;
