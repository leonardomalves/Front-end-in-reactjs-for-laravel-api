// src/pages/EditProduct.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Container, 
  Paper, 
  Typography,
  Box
} from '@mui/material';
import ProductForm from '../../components/ProductForm';
import { useProductContext } from '../../context/ProducContext';
import { IProduct } from '../../context/ProducContext';

const EditProduct: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, updateProduct, addProduct } = useProductContext();
  const [product, setProduct] = useState<IProduct | null>(null);

  useEffect(() => {
    if (id && Array.isArray(products)) {
      console.log(products);
      const productToEdit = products.find((p) => p.id === Number(id));
      if (productToEdit) {
        setProduct(productToEdit);
      } else {
        console.warn(`Produto com ID ${id} não encontrado.`);
      }
    }
  }, [id, products]);


  const handleSubmit = async (productData: Omit<IProduct, 'id'>) => {
    if (id) {
      await updateProduct(Number(id), productData);
    } else {
      await addProduct(productData);
    }
    navigate('/');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {id ? 'Editar Produto' : 'Criar Novo Produto'}
        </Typography>
        <Paper elevation={3} sx={{ p: 3 }}>
          <ProductForm 
          
            initialProduct={product || undefined} 
            onSubmit={handleSubmit}
          />
        </Paper>
      </Box>
    </Container>
  );
};

export default EditProduct;