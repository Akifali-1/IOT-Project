import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom'; // Import BrowserRouter
import './index.css';

createRoot(document.getElementById('root')).render(
<>

     {/* Wrap App with BrowserRouter */}
     <div className="transition-all duration-250 ease-linear ">
      <App />
    </div>
    </>
);
