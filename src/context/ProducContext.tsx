import React, { createContext, useContext, useState, useEffect } from 'react';
import { getProducts, addProduct, updateProduct, deleteProduct } from '../services/api';
import { IProduct } from '../interfaces/productsTypes';

export type { IProduct }; // Exportando a interface

interface PaginationMeta {
  current_page: number;
  last_page: number;
  total: number;
}

interface ProductContextType {
  products: IProduct[];
  paginationMeta: PaginationMeta | null;
  currentPage: number;
  setCurrentPage: (page: number) => void;
  addProduct: (product: Omit<IProduct, 'id'>) => Promise<void>;
  updateProduct: (id: number, product: Omit<IProduct, 'id'>) => Promise<void>;
  deleteProduct: (id: number) => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

interface ProductProviderProps {
  children: React.ReactNode;
}

export const ProductProvider: React.FC<ProductProviderProps> = ({ children }) => {
  const [products, setProducts] = useState<IProduct[]>([]);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const data = await getProducts(currentPage);
        setProducts(data.data); // Atualiza a lista de produtos
        setPaginationMeta(data.meta); // Atualiza os metadados da paginação
      } catch (error) {
        console.error("Erro ao buscar produtos:", error);
      }
    };

    fetchProducts();
  }, [currentPage]); // Atualiza sempre que a página mudar

  const handleAddProduct = async (product: Omit<IProduct, 'id'>) => {
    try {
      const newProduct = await addProduct(product);
      setProducts((prev) => [...prev, newProduct]); // Adiciona ao estado
    } catch (error) {
      console.error("Erro ao adicionar produto:", error);
    }
  };

  const handleUpdateProduct = async (id: number, product: Omit<IProduct, 'id'>) => {
    try {
      const updatedProduct = await updateProduct(id, product);
      setProducts((prev) =>
          prev.map((p) => (p.id === id ? updatedProduct : p))
      );
    } catch (error) {
      console.error("Erro ao atualizar produto:", error);
    }
  };

  const handleDeleteProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p.id !== id));
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
    throw new Error('useProductContext must be used within a ProductProvider');
  }
  return context;
};
