import React, { useState } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useProductContext} from "../context/ProducContext.tsx";

const AddProduct: React.FC = () => {
  const { addProduct, fetchProducts } = useProductContext(); // Usa o contexto
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    stock: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.price || !formData.stock) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    try {
      await addProduct({
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        stock: parseInt(formData.stock),
      });

      fetchProducts(); // 🔄 Atualiza a lista de produtos
      navigate("/"); // 🔄 Redireciona para a listagem
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  return (
      <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Adicionar Produto
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
              name="name"
              label="Nome"
              variant="outlined"
              fullWidth
              required
              value={formData.name}
              onChange={handleChange}
              sx={{ mb: 2 }}
          />
          <TextField
              name="description"
              label="Descrição"
              variant="outlined"
              fullWidth
              multiline
              rows={3}
              value={formData.description}
              onChange={handleChange}
              sx={{ mb: 2 }}
          />
          <TextField
              name="price"
              label="Preço"
              type="number"
              variant="outlined"
              fullWidth
              required
              value={formData.price}
              onChange={handleChange}
              sx={{ mb: 2 }}
          />
          <TextField
              name="stock"
              label="Estoque"
              type="number"
              variant="outlined"
              fullWidth
              required
              value={formData.stock}
              onChange={handleChange}
              sx={{ mb: 2 }}
          />
          <Button type="submit" variant="contained" color="primary" fullWidth>
            Adicionar
          </Button>
        </form>
      </Box>
  );
};

export default AddProduct;
