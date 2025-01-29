// src/components/ProductItem.tsx
import React from 'react';
import { IProduct } from '../context/ProductContext';
import {
  ListItem,
  ListItemText,
  Typography,
  Button,
  Box,
} from '@mui/material';
import { Link } from 'react-router-dom';

interface ProductItemProps {
  product: IProduct;
  onDelete: (id: number) => void;
}

const ProductItem: React.FC<ProductItemProps> = ({ product, onDelete }) => {
  return (
    <ListItem
      sx={{
        border: '1px solid #e0e0e0',
        borderRadius: '4px',
        mb: 2,
        boxShadow: 1,
      }}
    >
      <ListItemText
        primary={
          <Typography variant="h6" component="div">
            {product.name}
          </Typography>
        }
        secondary={
          <>
            <Typography variant="body2" color="text.secondary">
              {product.description}
            </Typography>
            <Typography variant="body1" color="primary" fontWeight="bold">
              ${product.price}
            </Typography>
          </>
        }
      />
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button
          variant="contained"
          color="error"
          onClick={() => onDelete(product.id)}
        >
          Deletar
        </Button>
        <Button
          component={Link}
          to={`/edit/${product.id}`}
          variant="contained"
          color="warning"
        >
          Editar
        </Button>
      </Box>
    </ListItem>
  );
};

export default ProductItem;