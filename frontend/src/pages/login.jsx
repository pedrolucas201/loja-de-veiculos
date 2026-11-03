// pages/login.jsx (ou onde seu componente de login estiver localizado)
import { useState } from "react";
import { useRouter } from "next/router";
import api from "../services/api"; // Seu Axios instance
import { useAuth } from "../contexts/AuthContext"; // Importe o useAuth do seu AuthContext

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", { email, password });
      const { token } = res.data;

      localStorage.setItem("token", token);
  

      login(token);

      router.push("/dashboard"); // Redireciona para o dashboard após o login
    } catch (error) {
      console.error("Erro no login:", error);
      alert("Erro no login: Credenciais inválidas ou problema de conexão.");
    }
  };

  return (
    <div className="min-h-screen bg-neutral-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-neutral-800 rounded-lg shadow-lg p-8">
        <h1 className="text-3xl font-bold mb-6 text-center text-white">Loja de Veículos</h1> {/* Adicionei text-white */}
        <form onSubmit={handleSubmit}>
          <label className="block mb-2 text-sm text-neutral-300">Email</label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 mb-4 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-400 focus:outline-none focus:border-brand-500" // Adicionei text-white e placeholder
          />
          <label className="block mb-2 text-sm text-neutral-300">Senha</label>
          <input
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-2 mb-6 bg-neutral-700 border border-neutral-600 rounded text-white placeholder-neutral-400 focus:outline-none focus:border-brand-500" // Adicionei text-white e placeholder
          />
          <button
            type="submit"
            className="w-full py-3 bg-brand-500 hover:bg-brand-600 rounded-full font-semibold text-white transition"
          >
            Entrar
          </button>
        </form>
      </div>
    </div>
  );
}