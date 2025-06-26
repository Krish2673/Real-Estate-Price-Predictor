import React from 'react';
import ReactDOM from 'react-dom/client';
import {createBrowserRouter, RouterProvider } from 'react-router-dom';

import App from './App.jsx';
import Home from './components/Home.jsx';
import Visualizations from './components/Visualizations.jsx';
import MapView from './components/MapView.jsx';
import DatasetExplorer from './components/DatasetExplorer.jsx';
import About from './components/About.jsx';
import './index.css';

const router = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    children: [
      { index: true, element: <Home /> },
      { path: 'visualizations', element: <Visualizations /> },
      { path: 'map', element: <MapView /> },
      { path: 'explorer', element: <DatasetExplorer /> },
      { path: 'about', element: <About /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);