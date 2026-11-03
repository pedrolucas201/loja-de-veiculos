// pages/estoque.jsx
import { useEffect, useState, useMemo } from "react";
import api from "../services/api";
import Link from "next/link";

export default function Estoque() {
  const [anuncios, setAnuncios] = useState([]);
  const [filtros, setFiltros] = useState({
    busca: "",
    marca: "",
    modelo: "",
    ano: "",
    minPreco: "", // Alterado para minPreco
    maxPreco: ""  // Adicionado maxPreco
  });

  useEffect(() => {
    const fetchAnuncios = async () => {
      try {
        const res = await api.get("/anuncios");
        setAnuncios(res.data);
      } catch (error) {
        console.error("Erro ao buscar anúncios:", error);
      }
    };
    fetchAnuncios();
  }, []);

  // Valores únicos de marca, modelo e ano para os filtros
  const dadosParaFiltros = useMemo(() => {
    const todasMarcas = [...new Set(anuncios.map(a => a.marca))].filter(Boolean).sort();
    const todosModelos = [...new Set(anuncios.map(a => a.modelo))].filter(Boolean).sort();
    const todosAnos = [...new Set(anuncios.map(a => a.ano))].filter(Boolean).sort((a, b) => b - a);
    return { todasMarcas, todosModelos, todosAnos };
  }, [anuncios]);

  const filtrados = anuncios.filter(a => {
    const preco = parseFloat(a.preco);
    const minPreco = parseFloat(filtros.minPreco);
    const maxPreco = parseFloat(filtros.maxPreco);
    
    return (
      (!filtros.busca || `${a.marca} ${a.modelo}`.toLowerCase().includes(filtros.busca.toLowerCase())) &&
      (!filtros.marca || a.marca === filtros.marca) &&
      (!filtros.modelo || a.modelo === filtros.modelo) &&
      (!filtros.ano || a.ano === parseInt(filtros.ano)) &&
      // Faixa de preço
      (!filtros.minPreco || preco >= minPreco) &&
      (!filtros.maxPreco || preco <= maxPreco)
    );
  });

  const handleClearFiltros = () => {
    setFiltros({ busca: "", marca: "", modelo: "", ano: "", minPreco: "", maxPreco: "" });
  };

  return (
    <>
      <div className="container mx-auto px-4 py-6 lg:grid lg:grid-cols-4 gap-6 min-h-screen">
        {/* sidebar */}
        <aside className="bg-neutral-800 p-4 rounded-lg text-white lg:block hidden sticky top-4 self-start max-h-[calc(100vh-2rem)] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Busca Rápida</h2>
          <input
            type="text"
            placeholder="Pesquisar..."
            className="w-full mb-4 p-2 bg-neutral-700 rounded"
            value={filtros.busca}
            onChange={e => setFiltros(prev => ({ ...prev, busca: e.target.value }))}
          />
          <h2 className="text-xl font-semibold mb-4">Filtros</h2>
          
          {/* Filtro de marca */}
          <select
            className="w-full mb-3 p-2 bg-neutral-700 rounded"
            value={filtros.marca}
            onChange={e => setFiltros(prev => ({...prev, marca: e.target.value}))}
          >
            <option value="">Marca</option>
            {dadosParaFiltros.todasMarcas.map(marca => (
              <option key={marca} value={marca}>{marca}</option>
            ))}
          </select>

          {/* Filtro de modelo */}
          <select
            className="w-full mb-3 p-2 bg-neutral-700 rounded"
            value={filtros.modelo}
            onChange={e => setFiltros(prev => ({...prev, modelo: e.target.value}))}
          >
            <option value="">Modelo</option>
            {dadosParaFiltros.todosModelos.map(modelo => (
              <option key={modelo} value={modelo}>{modelo}</option>
            ))}
          </select>

          {/* Filtro de ano */}
          <select
            className="w-full mb-3 p-2 bg-neutral-700 rounded"
            value={filtros.ano}
            onChange={e => setFiltros(prev => ({...prev, ano: e.target.value}))}
          >
            <option value="">Ano</option>
            {dadosParaFiltros.todosAnos.map(ano => (
              <option key={ano} value={ano}>{ano}</option>
            ))}
          </select>

          {/* Preço mínimo e máximo */}
          <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300">Preço Mínimo</label>
              <input
                  type="number"
                  placeholder="R$ Mínimo"
                  className="w-full p-2 bg-neutral-700 rounded mt-1"
                  value={filtros.minPreco}
                  onChange={e => setFiltros(prev => ({...prev, minPreco: e.target.value}))}
              />
          </div>
          <div className="mb-3">
              <label className="block text-sm font-medium text-gray-300">Preço Máximo</label>
              <input
                  type="number"
                  placeholder="R$ Máximo"
                  className="w-full p-2 bg-neutral-700 rounded mt-1"
                  value={filtros.maxPreco}
                  onChange={e => setFiltros(prev => ({...prev, maxPreco: e.target.value}))}
              />
          </div>
          
          <button onClick={handleClearFiltros} className="mt-2 underline">Limpar filtros</button>
        </aside>
        
        {/* grid anúncios */}
        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtrados.map(a => (
            <div key={a._id} className="bg-neutral-800 rounded-lg shadow overflow-hidden hover:shadow-xl">
              {a.fotos?.[0] && (
                <img
                  src={`${process.env.NEXT_PUBLIC_UPLOAD_URL}${a.fotos[0]}`}
                  alt={a.modelo}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4 text-white">
                <h3 className="font-semibold">{a.marca} {a.modelo}</h3>
                <p className="text-brand-500 mt-1 font-bold">
                  {a.preco.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                </p>
                <p className="text-neutral-400 mt-1">{a.ano} • {a.km} km</p>
                <Link href={`/anuncio/${a._id}`} className="mt-4 inline-block px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600">
                  Ver mais
                </Link>
              </div>
            </div>
          ))}
          {filtrados.length === 0 && (
            <p className="text-neutral-400 col-span-full">Nenhum veículo encontrado.</p>
          )}
        </div>
      </div>
    </>
  );
}