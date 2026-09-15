import { StrictMode } from 'react';
import { ViteReactSSG } from 'vite-react-ssg/single-page';
import './styles/fonts.css';
import './styles/index.css';
import { App } from './App';

// Pre-rendered at build time (vite-react-ssg), hydrated in the browser.
export const createRoot = ViteReactSSG(
  <StrictMode>
    <App />
  </StrictMode>,
);
