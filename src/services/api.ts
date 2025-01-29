// src/mockApi.ts

import axios from "axios";

const API_URL = "https://rest-full.neutrino.dev.br/api/products"; // Ajuste conforme necessário

export interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
}


export const getProducts = async (page = 1, filters = {}) => {
    const params = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
        if (value) {
            params.append(key, value);
        }
    });

    params.append("page", page.toString());

    const response = await axios.get(`${API_URL}?${params.toString()}`);
    return response.data;
};

export const showProduct = async (id: number): Promise<Product> => {
    try {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data.data; // Ajuste conforme a estrutura de resposta da sua API
    } catch (error) {
        console.error(`Erro ao buscar produto ${id}:`, error);
        throw error;
    }
};

export const addProduct = async (product: Omit<Product, "id">) => {
    const response = await axios.post(API_URL, product);
    return response.data;
};



export const updateProduct = async (id: number, product: Omit<Product, "id">) => {
    const response = await axios.put(`${API_URL}/${id}`, product);
    return response.data;
};

export const deleteProduct = async (id: number) => {
    await axios.delete(`${API_URL}/${id}`);
};