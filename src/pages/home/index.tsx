// src/pages/home/index.tsx
import React from 'react';
import ProductList from '../../components/ProductList';
import { 
  Container,
  Box
} from '@mui/material';

const Home: React.FC = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ py: 4 }}>


        <ProductList />
      </Box>
    </Container>
  );
};

export default Home;