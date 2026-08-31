import { TooltipProvider } from '@/components/ui/tooltip';
import { createRoot } from 'react-dom/client';
import { StrictMode } from 'react';
import { App } from './App.tsx';
import './index.css';

const root = createRoot(document.getElementById('root')!);

root.render(
  <StrictMode>
    <TooltipProvider>
      <App />
    </TooltipProvider>
  </StrictMode>,
);
