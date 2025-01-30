import React, {useState, useEffect} from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    TextField,
    Button,
    Typography,
    Box,
    TablePagination,
    Card,
    CardContent,
    Chip,
    useMediaQuery, IconButton,
} from "@mui/material";
import {Link} from "react-router-dom";
import {Edit, Delete} from "@mui/icons-material";
import {deleteProduct, getProducts} from "../services/api";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";
import { useProductContext} from "../context/ProducContext.tsx";

const ProductList: React.FC = () => {
    const [products, setProducts] = useState([]);
    const [filters, setFilters] = useState({
        name: "",
    });
    const [page, setPage] = useState(1);
    const [rowsPerPage] = useState(5); // 🔒 Fixado conforme a API
    const [totalProducts, setTotalProducts] = useState(0);
    const [lastPage, setLastPage] = useState(1);
    const isMobile = useMediaQuery("(max-width: 768px)");

    useEffect(() => {
        const delayDebounceFn = setTimeout(() => {
            setPage(1);
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
        const {name, value} = e.target;
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
        <Box sx={{p: 3}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Lista de Produtos
            </Typography>

            {/* Campos de Filtro */}
            <Box sx={{display: "flex", gap: 2, mb: 3, flexWrap: "wrap"}}>
                <TextField
                    name="name"
                    label="Nome"
                    variant="outlined"
                    value={filters.name}
                    onChange={handleFilterChange}
                    fullWidth
                />
            </Box>

            {/* Tabela ou Cards */}
            {isMobile ? (
                <Box
                    sx={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                        gap: 2,
                    }}
                >
                    {products.map((product) => (
                        <Card
                            key={product.id}
                            sx={{
                                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                borderRadius: 4,
                                p: 2,
                            }}
                        >
                            <CardContent>
                                <Typography variant="h6" sx={{fontWeight: "bold", mb: 1}}>
                                    {product.name}
                                </Typography>
                                <Typography variant="body2" sx={{mb: 1, color: "#777"}}>
                                    {product.description || "Sem descrição"}
                                </Typography>
                                <Box sx={{display: "flex", justifyContent: "space-between", mb: 1}}>
                                    <Chip
                                        label={`Estoque: ${product.stock}`}
                                        sx={{backgroundColor: "#E3F2FD", color: "#1976D2"}}
                                    />
                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                        R$ {parseFloat(product.price).toFixed(2)}
                                    </Typography>
                                </Box>
                                <Typography variant="caption" sx={{color: "#999"}}>
                                    Última Atualização:{" "}
                                    {product.updated_at
                                        ? format(new Date(product.updated_at), "dd/MM/yyyy", {locale: ptBR})
                                        : "-"}
                                </Typography>
                                <Box sx={{display: "flex", gap: 1, mt: 2}}>
                                    <Button
                                        component={Link}
                                        to={`/edit/${product.id}`}
                                        variant="outlined"
                                        size="small"
                                    >
                                        Editar
                                    </Button>
                                    <Button variant="contained" color="error" size="small">
                                        Deletar
                                    </Button>
                                </Box>
                            </CardContent>
                        </Card>
                    ))}
                </Box>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>ID</TableCell>
                                <TableCell>Nome</TableCell>
                                <TableCell>Descrição</TableCell>
                                <TableCell>Preço</TableCell>
                                <TableCell>Estoque</TableCell>
                                <TableCell>Data de Criação</TableCell>
                                <TableCell>Última Atualização</TableCell>
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
                                            ? format(new Date(product.created_at), "dd/MM/yyyy", {locale: ptBR})
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        {product.updated_at
                                            ? format(new Date(product.updated_at), "dd/MM/yyyy", {locale: ptBR})
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/edit/${product.id}`} color="warning"
                                                    size="small">
                                            <Edit/>
                                        </IconButton>
                                        <IconButton color="error" size="small"
                                                    onClick={() => deleteProduct(product.id)}>
                                            <Delete/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {/* Paginação */}
            <TablePagination
                component="div"
                count={totalProducts}
                rowsPerPage={rowsPerPage}
                page={page - 1}
                onPageChange={handleChangePage}
                rowsPerPageOptions={[]}
                labelRowsPerPage="Linhas por página"
                nextIconButtonProps={{disabled: page >= lastPage}}
                backIconButtonProps={{disabled: page <= 1}}
            />
        </Box>
    );
};

export default ProductList;
