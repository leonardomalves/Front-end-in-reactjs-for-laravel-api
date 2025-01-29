import React, { createContext, useContext, useState, useEffect } from "react";
import { getProducts, addProduct, updateProduct, deleteProduct } from "../services/api";

export interface IProduct {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  created_at: string;
  updated_at: string;
}

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
  per_page: number;
}

interface ProductContextType {
  products: IProduct[];
  paginationMeta: PaginationMeta | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  fetchProducts: (page?: number) => void;
  addProduct: (product: Omit<IProduct, "id">) => Promise<void>;
  updateProduct: (id: number, product: Omit<IProduct, "id">) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  // Busca produtos da API conforme a página atual
  const fetchProducts = async (page: number = currentPage) => {
    try {
      const response = await getProducts(page);
      setProducts(response.data);
      setPaginationMeta({
        current_page: response.meta.current_page,
        last_page: response.meta.last_page,
        total: response.meta.total,
        per_page: response.meta.per_page,
      });
      setCurrentPage(response.meta.current_page);
    } catch (error) {
      console.error("Erro ao buscar produtos:", error);
    }
  };

  useEffect(() => {
    fetchProducts(); // 🔄 Busca produtos ao carregar o contexto
  }, []);


  const handleAddProduct = async (product: Omit<IProduct, "id">) => {
    try {
      await addProduct(product);

      fetchProducts(1); // Sempre recarrega a primeira página após um novo produto
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  // Atualiza um produto e recarrega a página atual
  const handleUpdateProduct = async (id: number, product: Omit<IProduct, "id">) => {
    try {
      await updateProduct(id, product);
      fetchProducts(currentPage); // Recarrega a página onde o produto estava
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  // Exclui um produto e recarrega a página
  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      fetchProducts(currentPage); // Mantém a paginação correta ao excluir
    } catch (error) {
      console.error("Erro ao deletar produto:", error);
    }
  };

  return (
      <ProductContext.Provider
          value={{
            products,
            paginationMeta,
            currentPage,
            setCurrentPage,
            fetchProducts,
            addProduct: handleAddProduct,
            updateProduct: handleUpdateProduct,
            deleteProduct: handleDeleteProduct,
          }}
      >
        {children}
      </ProductContext.Provider>
  );
};

export const useProductContext = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error("useProductContext deve ser usado dentro de um ProductProvider");
  }
  return context;
};
