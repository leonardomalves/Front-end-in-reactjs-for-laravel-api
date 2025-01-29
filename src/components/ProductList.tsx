import React, { useState, useEffect } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    // Button,
    Typography,
    Box,
    TablePagination, IconButton,
} from "@mui/material";

import { Edit, Delete } from "@mui/icons-material";

import { Link } from "react-router-dom";
import { getProducts } from "../services/api"; // ✅ Importando API
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";


const ProductList: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
        description: "",
        price: "",
        stock: "",
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5); // 🔒 Fixado conforme a API
    const [totalProducts, setTotalProducts] = useState(0);
    const [lastPage, setLastPage] = useState(1);

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPage(1); // 🔄 Sempre volta para a página 1 ao iniciar nova busca
        }, 500);

        return () => clearTimeout(delayDebounceFn);
    }, [filters]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProducts(page, filters);
                setProducts(response.data);
                setTotalProducts(response.meta.total);
                setLastPage(response.meta.last_page);
            } catch (error) {
                console.error("Erro ao buscar produtos:", error);
            }
        };

        fetchProducts();
    }, [page, filters]);

    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prev) => ({
            ...prev,
            [name]: name === "price" || name === "stock" ? value.replace(/[^0-9.]/g, "") : value,
        }));
    };

    const handleChangePage = (_event: unknown, newPage: number) => {
        if (newPage + 1 >= 1 && newPage + 1 <= lastPage) {
            setPage(newPage + 1);
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Lista de Produtos
            </Typography>

            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    name="name"
                    label="Nome"
                    variant="outlined"
                    value={filters.name}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    name="description"
                    label="Descrição"
                    variant="outlined"
                    value={filters.description}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    name="price"
                    label="Preço"
                    type="text"
                    variant="outlined"
                    value={filters.price}
                    onChange={handleFilterChange}
                    fullWidth
                />
                <TextField
                    name="stock"
                    label="Estoque"
                    type="text"
                    variant="outlined"
                    value={filters.stock}
                    onChange={handleFilterChange}
                    fullWidth
                />
            </Box>
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>ID</TableCell>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Preço</TableCell>
                            <TableCell>Estoque</TableCell>
                            <TableCell>Data de criação</TableCell>
                            <TableCell>Ultima Atualização</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.id}</TableCell>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    {product.created_at
                                        ? format(new Date(product.created_at), "dd/MM/yyyy H:mm:ss", { locale: ptBR })
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    {product.updated_at
                                        ? format(new Date(product.updated_at), "dd/MM/yyyy H:mm:ss", { locale: ptBR })
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    <IconButton component={Link} to={`/edit/${product.id}`} color="warning" size="small">
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" size="small" onClick={() => onDelete(product.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={totalProducts}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[]}
                slotProps={{
                    actions: {
                        previousButton: { disabled: page <= 1 },
                        nextButton: { disabled: page >= lastPage },
                    },
                }}
            />
        </Box>
    );
};

export default ProductList;
