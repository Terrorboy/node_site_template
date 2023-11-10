import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import Index from './Component/home';

const root = ReactDOM.createRoot(document.body);
root.render(
    <BrowserRouter>
        <Index />
    </BrowserRouter>
);