import React, { useState, useEffect } from "react";
import { TextField, Button, Box, Typography } from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useProductContext} from "../context/ProducContext.tsx";

const ProductForm: React.FC = () => {
    const { id } = useParams<{ id: string }>(); // Obtém o ID da URL
    const { addProduct, updateProduct, fetchProducts, products } = useProductContext();
    const navigate = useNavigate();

    // Estado inicial do formulário
    const initialFormState = {
        name: "",
        description: "",
        price: "",
        stock: "",
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (id) {
            // Se estiver editando, carregar os dados do produto
            const product = products.find((p) => p.id === Number(id));
            if (product) {
                setFormData({
                    name: product.name,
                    description: product.description,
                    price: product.price.toString(),
                    stock: product.stock.toString(),
                });
            }
        } else {
            // Se for um novo produto, resetar o formulário
            setFormData(initialFormState);
        }
    }, [id, products]);

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
            if (id) {
                // Edição de produto
                await updateProduct(Number(id), {
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                });
            } else {
                // Criação de novo produto
                await addProduct({
                    name: formData.name,
                    description: formData.description,
                    price: parseFloat(formData.price),
                    stock: parseInt(formData.stock),
                });
            }

            fetchProducts(); // 🔄 Atualiza a lista de produtos
            navigate("/"); // 🔄 Redireciona para a listagem
        } catch (error) {
            console.error("Erro ao salvar produto:", error);
        }
    };

    return (
        <Box sx={{ p: 3, maxWidth: 500, mx: "auto" }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {id ? "Editar Produto" : "Adicionar Produto"}
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
                    {id ? "Salvar Alterações" : "Adicionar"}
                </Button>
            </form>
        </Box>
    );
};

export default ProductForm;
