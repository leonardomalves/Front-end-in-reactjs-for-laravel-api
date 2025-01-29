// src/components/ProductForm.tsx
import React, { useState, useEffect } from "react";
import {
    TextField,
    Button,
    Stack,
    Box,
} from "@mui/material";
import { IProduct } from "../interfaces/productsTypes";
import { showProduct } from "../services/api";
import { useParams } from "react-router-dom";

interface ProductFormProps {
    initialProduct?: IProduct;
    onSubmit: (product: Omit<IProduct, "id">) => void;
}

const ProductForm: React.FC<ProductFormProps> = ({
                                                     initialProduct,
                                                     onSubmit,
                                                 }) => {
    const { id } = useParams<{ id: string }>();
    const [name, setName] = useState(initialProduct?.name || "");
    const [price, setPrice] = useState(initialProduct?.price || 0);
    const [description, setDescription] = useState(initialProduct?.description || "");
    const [stock, setStock] = useState(initialProduct?.stock || 0);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // 🔹 Se for edição, buscar produto na API
        const fetchProduct = async () => {
            if (id) {
                setLoading(true);
                try {
                    const product = await showProduct(Number(id));
                    setName(product.name);
                    setPrice(product.price);
                    setDescription(product.description);
                    setStock(product.stock);
                } catch (error) {
                    console.error("Erro ao buscar produto:", error);
                } finally {
                    setLoading(false);
                }
            }
        };
        fetchProduct();
    }, [id]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit({ name, price, description, stock });
    };

    return (
        <Box component="form" onSubmit={handleSubmit}>
            {loading ? (
                <p>Carregando produto...</p>
            ) : (
                <Stack spacing={3}>
                    <TextField
                        fullWidth
                        label="Nome do Produto"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Preço"
                        value={price}
                        onChange={(e) => setPrice(Number(e.target.value))}
                        required
                    />
                    <TextField
                        fullWidth
                        label="Descrição"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        multiline
                        rows={4}
                    />
                    <TextField
                        fullWidth
                        type="number"
                        label="Estoque"
                        value={stock}
                        onChange={(e) => setStock(Number(e.target.value))}
                        required
                    />
                    <Button variant="contained" type="submit" size="large">
                        Salvar
                    </Button>
                </Stack>
            )}
        </Box>
    );
};

export default ProductForm;
