// pages/contato.jsx
import { useState } from "react";

export default function Contato() {
  const [form, setForm] = useState({ nome:'', email:'', telefone:'', mensagem:'' });

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Aqui você pode enviar os dados do formulário para o servidor
    const whatsapp = `https://api.whatsapp.com/send?phone=5581993259534&text=Nome: ${form.nome}%0AEmail: ${form.email}%0ATelefone: ${form.telefone}%0AMensagem: ${form.mensagem}`;
    window.open(whatsapp, '_blank'); // Abre o WhatsApp com os dados do formulário
    alert("Mensagem enviada com sucesso!");
    setForm({ nome:'', email:'', telefone:'', mensagem:'' }); // Limpa o formulário
  };

    // Renderiza o formulário de contato
  return (
    <>
      <div className="container mx-auto py-8 px-4 text-white">
        <h1 className="text-3xl font-bold mb-6">Contato</h1>
        <form onSubmit={handleSubmit} className="bg-neutral-800 p-6 rounded-lg space-y-4">
          {["nome","email","telefone"].map(k=>(
            <input
              key={k} type={k==="email"?"email":"text"} placeholder={k.charAt(0).toUpperCase()+k.slice(1)}
              value={form[k]} onChange={e=>setForm(prev=>({...prev,[k]:e.target.value}))}
              className="w-full p-3 bg-neutral-700 rounded"
            />
          ))}
          <textarea
            placeholder="Mensagem"
            value={form.mensagem}
            onChange={e=>setForm(prev=>({...prev, mensagem:e.target.value}))}
            className="w-full p-3 bg-neutral-700 rounded"
          />
          <button type="submit" className="px-6 py-2 bg-brand-500 hover:bg-brand-600 rounded font-semibold">
            Enviar Mensagem
          </button>
        </form>
      </div>
    </>
  );
}
