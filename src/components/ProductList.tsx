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
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Link } from "react-router-dom";
import { useProductContext } from "../context/ProducContext";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

const ProductList: React.FC = () => {
    const { products, fetchProducts, deleteProduct, paginationMeta } = useProductContext();
    const [page, setPage] = useState(0);

    // Manipula a troca de página
    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage);
        fetchProducts(newPage + 1); // Chama a API com a nova página
    };

    // Exclui produto e atualiza lista
    const handleDeleteProduct = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
        await deleteProduct(id);
        fetchProducts(page + 1); // Recarrega a página atual
    };

    return (
        <Box sx={{ p: 3 }}>
            <Typography variant="h4" component="h1" gutterBottom>
                Lista de Produtos
            </Typography>

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
                    page={paginationMeta.current_page - 1}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[]} // Remove opções de troca de "itens por página"
                />
            )}
        </Box>
    );
};

export default ProductList;
