import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { Toaster } from "react-hot-toast";
// import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react'
import {BrowserRouter,Router} from "react-router-dom"
import ChatProvider from "./Context/ChatProvider"

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  
  
    <ChakraProvider>
      <BrowserRouter>
      <ChatProvider>
        <App />
        <Toaster/>
        </ChatProvider>
      </BrowserRouter>
    </ChakraProvider>
   
 
);


