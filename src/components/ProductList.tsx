import React, {useState} from "react";
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
    useMediaQuery,
    Card,
    CardContent,
    Chip,
} from "@mui/material";
import {Edit, Delete} from "@mui/icons-material";
import {Link} from "react-router-dom";
import {useProductContext} from "../context/ProducContext";
import {format} from "date-fns";
import {ptBR} from "date-fns/locale";

const ProductList: React.FC = () => {
    const {fetchProducts, deleteProduct, products, paginationMeta} = useProductContext();
    const [page, setPage] = useState(1);
    const [filters, setFilters] = useState({name: ""});
    const [searchFilters, setSearchFilters] = useState({name: ""});
    const isMobile = useMediaQuery("(max-width: 768px)"); // Detecta tela menor


    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;
        setFilters((prevFilters) => ({
            ...prevFilters,
            [name]: value,
        }));
    };


    const handleSearch = () => {
        setSearchFilters(filters); // Aplica os filtros
        fetchProducts(page, {name: filters.name}); // Faz a busca com os filtros aplicados
    };


    const handleChangePage = (_event: unknown, newPage: number) => {
        setPage(newPage + 1);
        fetchProducts(newPage + 1, searchFilters); // Busca com a nova página e filtros aplicados
    };

    const handleDeleteProduct = async (id: number) => {
        if (!window.confirm("Tem certeza que deseja excluir este produto?")) return;
        await deleteProduct(id);
        fetchProducts(page, searchFilters); // Atualiza a lista após exclusão
    };

    return (
        <Box sx={{p: 3}}>
            <Typography variant="h4" component="h1" gutterBottom>
                Lista de Produtos
            </Typography>

            <Box sx={{display: "flex", gap: 2, mb: 3, flexWrap: "wrap"}}>
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

            {/* Alternância entre Cards e Tabela */}
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
                                {/* Nome do Produto */}
                                <Typography variant="h6" sx={{fontWeight: "bold", mb: 1}}>
                                    {product.name}
                                </Typography>

                                {/* Estoque e Preço */}
                                <Box sx={{display: "flex", justifyContent: "space-between", mb: 1}}>
                                    <Chip
                                        label={`Estoque: ${product.stock}`}
                                        sx={{backgroundColor: "#E3F2FD", color: "#1976D2"}}
                                    />
                                    <Typography variant="body1" sx={{fontWeight: "bold"}}>
                                        R$ {parseFloat(product.price).toFixed(2)}
                                    </Typography>
                                </Box>

                                {/* Descrição */}
                                <Typography variant="body2" sx={{color: "#777", mb: 2}}>
                                    {product.description || "Sem descrição"}
                                </Typography>

                                {/* Última Atualização */}
                                <Typography variant="caption" sx={{color: "#999"}}>
                                    Última Atualização:{" "}
                                    {product.updated_at
                                        ? format(new Date(product.updated_at), "dd/MM/yyyy", {locale: ptBR})
                                        : "-"}
                                </Typography>

                                <Box sx={{display: "flex", gap: 2, mt: 2}}>
                                    <Button
                                        component={Link}
                                        to={`/edit/${product.id}`}
                                        variant="outlined"
                                        size="large"
                                    >
                                        Editar
                                    </Button>

                                    <Button
                                        variant="contained"
                                        color="error"
                                        size="large"
                                        onClick={() => handleDeleteProduct(product.id)}
                                    >
                                        Excluir
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
                                            ? format(new Date(product.updated_at), "dd/MM/yyyy H:mm:ss", {locale: ptBR})
                                            : "-"}
                                    </TableCell>
                                    <TableCell>
                                        <IconButton component={Link} to={`/edit/${product.id}`} color="warning"
                                                    size="small">
                                            <Edit/>
                                        </IconButton>
                                        <IconButton color="error" size="small"
                                                    onClick={() => handleDeleteProduct(product.id)}>
                                            <Delete/>
                                        </IconButton>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}

            {paginationMeta && (
                <TablePagination
                    component="div"
                    count={paginationMeta.total}
                    rowsPerPage={paginationMeta.per_page}
                    page={page - 1}
                    onPageChange={handleChangePage}
                    rowsPerPageOptions={[]}
                />
            )}
        </Box>
    );
};

export default ProductList;
