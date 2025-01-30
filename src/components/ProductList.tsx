import React, { useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Typography,
    Box,
    IconButton,
    TablePagination,
    TextField,
    Button,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useProductContext } from "../context/ProducContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ProductList: React.FC = () => {
    const { fetchProducts, deleteProduct, products, paginationMeta } = useProductContext();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({
        name: "",
    });
    const [searchFilters, setSearchFilters] = useState({
        name: "",
    }); // Filtros para busca final

    // Lida com mudanças nos campos de filtro
    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };

    // Executa a busca ao confirmar (Enter ou botão)
    const handleSearch = () => {
        setSearchFilters(filters); // Aplica os filtros
        fetchProducts(page, { name: filters.name }); // Faz a busca com os filtros aplicados
    };

    // Lida com a troca de páginas
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage + 1);
        fetchProducts(newPage + 1, searchFilters); // Busca com a nova página e filtros aplicados
    };

    // Exclui um produto e atualiza a lista
    const handleDeleteProduct = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
        await deleteProduct(id);
        fetchProducts(page, searchFilters); // Atualiza a lista após exclusão
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Lista de Produtos
            </Typography>

            {/* Filtros */}
            <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                    name="name"
                    label="Filtrar por Nome"
                    variant="outlined"
                    value={filters.name}
                    onChange={handleFilterChange}
                    onKeyUp={handleSearch}
                    fullWidth
                />
            </Box>

            {/* Tabela de Produtos */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Nome</TableCell>
                            <TableCell>Descrição</TableCell>
                            <TableCell>Preço</TableCell>
                            <TableCell>Estoque</TableCell>
                            <TableCell>Última Atualização</TableCell>
                            <TableCell>Ações</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell>{product.name}</TableCell>
                                <TableCell>{product.description}</TableCell>
                                <TableCell>R$ {parseFloat(product.price).toFixed(2)}</TableCell>
                                <TableCell>{product.stock}</TableCell>
                                <TableCell>
                                    {product.updated_at
                                        ? format(new Date(product.updated_at), "dd/MM/yyyy H:mm:ss", { locale: ptBR })
                                        : "-"}
                                </TableCell>
                                <TableCell>
                                    <IconButton component={Link} to={`/edit/${product.id}`} color="warning" size="small">
                                        <Edit />
                                    </IconButton>
                                    <IconButton color="error" size="small" onClick={() => handleDeleteProduct(product.id)}>
                                        <Delete />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Paginação */}
            {paginationMeta && (
                <TablePagination
                    component="div"
                    count={paginationMeta.total}
                    rowsPerPage={paginationMeta.per_page}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[]} // Remove opções de troca de "itens por página"
                />
            )}
        </Box>
    );
};

export default ProductList;
