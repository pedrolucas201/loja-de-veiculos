// src/components/Navbar.jsx
import Link from 'next/link';
import { useState } from 'react';

// 1. Receba 'isAdmin' como uma propriedade desestruturada do objeto de props
export default function Navbar({ isAdmin }) {


  const [open, setOpen] = useState(false);

  // Links públicos
  const publicLinks = [
    { href: '/', label: 'Início' },
    { href: '/estoque', label: 'Estoque' },
    // { href: '/vender', label: 'Venda seu veículo' },
    // { href: '/financiamento', label: 'Financiamento' },
    { href: '/quemsomos', label: 'Quem Somos' },
    { href: '/contato', 'label': 'Contato' },
  ];

  // Links de administração (se houver)
  const adminLinks = [
    { href: '/dashboard', label: 'Dashboard', className: 'inline-block mt-2 md:mt-0 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 transition' },
    { href: '/admin', label: 'Admin', className: 'inline-block mt-2 md:mt-0 px-4 py-2 bg-brand-500 text-white rounded hover:bg-brand-600 transition' },
  ];

  return (
    <nav className="bg-neutral-900 shadow-md border-b border-brand-700">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        {/* O link para a home page ou dashboard pode ser ajustado aqui */}
        <Link href="/" className="text-white text-2xl font-bold">Loja de Veículos</Link> {/* Mudei para "/" para a home page por padrão */}
        
        <button
          className="text-white md:hidden focus:outline-none" // Adicionado focus:outline-none para acessibilidade
          onClick={() => setOpen(!open)}
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={open ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}></path>
          </svg>
        </button>

        {/* 2. Unifique todos os links em um único <ul> */}
        <ul className={`md:flex md:items-center md:space-x-6 ${
          open ? 'block absolute top-16 left-0 w-full bg-neutral-900 border-t border-brand-700 p-4 shadow-lg z-10' : 'hidden'
        } md:static md:p-0 md:border-t-0 md:shadow-none`}>
          {publicLinks.map((l) => (
            <li key={l.href} className="mb-2 md:mb-0"> {/* Adiciona margem para mobile */}
              <Link href={l.href}
                 className="block py-2 text-neutral-300 hover:text-white font-medium transition duration-300 ease-in-out">
                  {l.label}
              </Link>
            </li>
          ))}
          {isAdmin && (
            <>
              {adminLinks.map((l) => (
                <li key={l.href} className="mb-2 md:mb-0">
                  <Link href={l.href} className={l.className}>
                      {l.label}
                  </Link>
                </li>
              ))}
            </>
          )}
        </ul>
      </div>
    </nav>
  );
}