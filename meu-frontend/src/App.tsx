import { Link, Routes, Route } from "react-router";

import Home from "./pages/Home";
import Produtos from "./pages/Produtos";
import Contato from "./pages/Contato";

function App() {

    return (

        <main className="min-h-screen bg-slate-100">

            <nav className="bg-blue-600 text-white p-4 flex gap-6">

                <Link to="/">Home</Link>

                <Link to="/produtos">Produtos</Link>

                <Link to="/contato">Contato</Link>

            </nav>

            <div className="p-10">

                <Routes>

                    <Route path="/" element={<Home />} />

                    <Route path="/produtos" element={<Produtos />} />

                    <Route path="/contato" element={<Contato />} />

                </Routes>

            </div>

        </main>

    );

}

export default App;