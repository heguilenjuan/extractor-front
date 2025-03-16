import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Plantillas from './pages/plantillas.tsx';
import Home from './pages/Home.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/plantillas' element={<Plantillas />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
