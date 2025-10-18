import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { HashRouter } from 'react-router-dom';
import { ChakraProvider } from '@chakra-ui/react';
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ChakraProvider>
      <HashRouter>
        <App />
      </HashRouter>
    </ChakraProvider>
  </StrictMode>,
)
