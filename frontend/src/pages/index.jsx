// pages/index.js

import { useState, useEffect, useMemo } from "react";
import api from "../services/api";

// Components
import AnuncioCard from "../components/AnuncioCard";
import Carrossel from "../components/Carrossel";
import Filtros from "../components/Filtros"; 
import { useAuth } from "../hooks/useAuth";

// Imagens do Carrossel
import imagem1 from '../assets/moto1.jpg';
import imagem2 from '../assets/moto2.jpg';
import imagem3 from '../assets/moto3.jpg';



export default function Home() {


  const [anuncios, setAnuncios] = useState([]); // Todos os anúncios carregados da API
  const [marcas, setMarcas] = useState([]);
  const [anos, setAnos] = useState([]);

  // Estados dos filtros
  const [filtroMarca, setFiltroMarca] = useState("");
  const [filtroAno, setFiltroAno] = useState("");
  const [filtroPrecoMin, setFiltroPrecoMin] = useState(""); // Estado para o preço mínimo selecionado no slider
  const [filtroPrecoMax, setFiltroPrecoMax] = useState(""); // Estado para o preço máximo selecionado no slider
  const [searchTerm, setSearchTerm] = useState("");

  // Estados de controle da UI
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const {isAdmin} = useAuth;

  // Valores globais de preço para o slider (min e max de todos os anúncios)
  // Usamos useMemo para garantir que eles sejam calculados apenas quando 'anuncios' muda.
  const minPrecoGlobal = useMemo(() => {
    if (anuncios.length === 0) return 0; // Ou um valor padrão razoável
    return Math.min(...anuncios.map((a) => a.preco));
  }, [anuncios]);

  const maxPrecoGlobal = useMemo(() => {
    if (anuncios.length === 0) return 100000; // Ou um valor padrão razoável, maior que o esperado
    return Math.max(...anuncios.map((a) => a.preco));
  }, [anuncios]);

  // Efeito para buscar os dados da API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await api.get("/anuncios");
        const fetchedAnuncios = res.data;
        setAnuncios(fetchedAnuncios);

        // Extrai marcas e anos únicos para os filtros
        const marcasUnicas = [...new Set(fetchedAnuncios.map((a) => a.marca))].sort();
        const anosUnicos = [...new Set(fetchedAnuncios.map((a) => a.ano))].sort(
          (a, b) => b - a
        );
        setMarcas(marcasUnicas);
        setAnos(anosUnicos);

        // O slider de preço começa na faixa completa dos anúncios
        if (fetchedAnuncios.length > 0) {
          const initialMinPrice = Math.min(...fetchedAnuncios.map((a) => a.preco));
          const initialMaxPrice = Math.max(...fetchedAnuncios.map((a) => a.preco));
          setFiltroPrecoMin(initialMinPrice.toString());
          setFiltroPrecoMax(initialMaxPrice.toString());
        } else {
          setFiltroPrecoMin("0"); // Se não houver anúncios, defina um padrão
          setFiltroPrecoMax("100000"); // Se não houver anúncios, defina um padrão
        }

      } catch (err) {
        console.error("Falha ao buscar anúncios:", err);
        setError(
          "Não foi possível carregar os veículos. Tente novamente mais tarde."
        );
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []); // Dependência vazia para executar apenas uma vez na montagem

  // Memoiza a lista de anúncios filtrados para evitar recálculos desnecessários
  const anunciosFiltrados = useMemo(() => {
    const lowerCaseSearchTerm = searchTerm.toLowerCase();

    return anuncios.filter((a) => {
      const passaMarca = !filtroMarca || a.marca === filtroMarca;
      const passaAno = !filtroAno || a.ano === parseInt(filtroAno, 10);

      // Faixa de preço do slider
      const min = parseFloat(filtroPrecoMin);
      const max = parseFloat(filtroPrecoMax);

      const passaPreco =
        (isNaN(min) || a.preco >= min) && (isNaN(max) || a.preco <= max);

      // Nova condição para o termo de pesquisa
      const passaPesquisa =
        !lowerCaseSearchTerm || // Se o termo de pesquisa estiver vazio, passa
        a.modelo.toLowerCase().includes(lowerCaseSearchTerm) ||
        a.marca.toLowerCase().includes(lowerCaseSearchTerm) ||
        a.ano.toString().includes(lowerCaseSearchTerm); // Converter ano para string para incluir

      return passaMarca && passaAno && passaPreco && passaPesquisa;
    });
  }, [anuncios, filtroMarca, filtroAno, filtroPrecoMin, filtroPrecoMax, searchTerm]);

  // Função para remover um anúncio da lista sem recarregar a página
  const handleAnuncioExcluido = (idExcluido) => {
    setAnuncios((prevAnuncios) =>
      prevAnuncios.filter((a) => a._id !== idExcluido)
    );
  };

  const slides = useMemo(() => {

    const imagensFixas = [
      {
        id: 'destaque-1',
        image: imagem1.src,
        title: 'Destaque da Semana',
        description: 'Condições especiais de financiamento',
        link: '/estoque',
      },
      {
        id: 'destaque-2',
        image: imagem2.src,
        title: 'Novidades no Estoque',
        description: 'Confira nossos últimos modelos',
        link: '/estoque',
      },
      {
        id: 'destaque-3',
        image: imagem3.src,
        title: 'Seu próximo veículo está aqui!',
        description: 'Encontre o carro dos seus sonhos',
        link: '/estoque',
      },
    ];

    return imagensFixas;
  }, []); 

  return (
    <>
      {<Carrossel slides={slides} />}

      <div className="container mx-auto p-6 text-white">
        <h1 className="text-3xl font-bold mb-4">Veículos Disponíveis</h1>

        {/* Input de Pesquisa */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Pesquisar por modelo, marca ou ano..."
            className="w-full p-3 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Aqui entraria o componente de Filtros */}
        {
          <Filtros
            marcas={marcas}
            anos={anos}
            setFiltroMarca={setFiltroMarca}
            setFiltroAno={setFiltroAno}
            filtroPrecoMin={filtroPrecoMin}
            setFiltroPrecoMin={setFiltroPrecoMin}
            filtroPrecoMax={filtroPrecoMax}
            setFiltroPrecoMax={setFiltroPrecoMax}
            minPrecoGlobal={minPrecoGlobal}
            maxPrecoGlobal={maxPrecoGlobal}
          />
        }


        {loading && <p className="text-center mt-10">Carregando veículos...</p>}

        {error && <p className="text-center mt-10 text-red-500">{error}</p>}

        {!loading && !error && (
          <>
            {anunciosFiltrados.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
                {anunciosFiltrados.map((anuncio) => (
                  <AnuncioCard
                    key={anuncio._id}
                    anuncio={anuncio}
                    isAdmin={isAdmin}
                    onAnuncioExcluido={handleAnuncioExcluido}
                  />
                ))}
              </div>
            ) : (
              <p className="text-neutral-400 mt-10 text-center">
                Nenhum veículo encontrado com os filtros aplicados.
              </p>
            )}
          </>
        )}
      </div>
    </>
  );
}