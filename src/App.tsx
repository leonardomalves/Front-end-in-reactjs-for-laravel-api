// src/App.tsx

import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { ProductProvider } from './context/ProducContext';
import Home from './pages/home';
import EditProduct from './pages/editProduct';
import Navbar from './components/NavBar';


const App = () => {
  return (
    <ProductProvider>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/home" element={<Navigate to="/" replace />} />
          <Route path="/add" element={<EditProduct />} />
          <Route path="/edit/:id" element={<EditProduct />} />
        </Routes>
        
      </Router>
    </ProductProvider>
  );
};

export default App;