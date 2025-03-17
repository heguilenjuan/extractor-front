import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Plantillas from './pages/Plantillas.tsx';
import Home from './pages/Home.tsx';
import ExtractPage from './pages/ExtractPage.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/plantillas' element={<Plantillas />} />
        <Route path='/extract-plantilla' element={<ExtractPage/>} />
      </Routes>
    </BrowserRouter>
  </StrictMode>,
);
