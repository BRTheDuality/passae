
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';

// Pequeno delay para garantir que o DOM e os imports estejam estáveis
const init = () => {
  const rootElement = document.getElementById('root');
  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
};

if (document.readyState === 'complete') {
  init();
} else {
  window.addEventListener('load', init);
}
