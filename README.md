# 📦 Frontend - Gerenciador de Produtos

Este é o frontend de um sistema de gerenciamento de produtos, desenvolvido com **React.js** e integrado a uma API RESTful.

## 🚀 Tecnologias Utilizadas

- **React.js** (com Vite)
- **TypeScript**
- **Material UI** (para estilização)
- **React Router** (para navegação)
- **Axios** (para comunicação com a API)

---

## 📌 Funcionalidades

✅ **Listagem de produtos com paginação**  
✅ **Cadastro e edição de produtos**  
✅ **Exclusão de produtos**  
✅ **Gerenciamento de estado com Context API**  
✅ **Navegação dinâmica com React Router**  

---

## 🔧 Como Executar o Frontend

### 📌 Pré-requisitos

Antes de rodar o frontend, certifique-se de que tem o **Node.js** e o **NPM** (ou Yarn) instalados.

1. **Clone o repositório:**
   ```bash
   git clone git@github.com:leonardomalves/Front-end-in-reactjs-for-laravel-api.git code-project
   cd code-project
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Configure a URL da API no arquivo `src/api.ts`:**
   ```ts
   const API_URL = "http://127.0.0.1:8000/api/products";
   ```

4. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

O frontend estará disponível em **http://localhost:5173**.

---

## 📁 Estrutura do Projeto

```
📂 src/
 ├── 📂 components/        # Componentes reutilizáveis
 │   ├── NavBar.tsx        # Barra de navegação
 │   ├── ProductForm.tsx   # Formulário de produtos
 │   ├── ProductItem.tsx   # Item de produto individual
 │   ├── ProductList.tsx   # Listagem de produtos
 │
 ├── 📂 context/            # Context API para gerenciamento de estado
 │   ├── ProductContext.tsx
 │
 ├── 📂 pages/              # Páginas principais
 │   ├── home/              # Página inicial
 │   │   ├── index.tsx
 │   ├── editProduct/       # Página de edição/criação de produtos
 │   │   ├── index.tsx
 │
 ├── 📂 services/           # API (requisições HTTP)
 │   ├── api.ts
 │
 ├── App.tsx               # Configuração principal do React
 ├── main.tsx              # Renderização do React
 ├── routes.tsx            # Configuração das rotas
 ├── vite-env.d.ts         # Configuração do Vite
```

---

## 📜 Rotas do Frontend

| Rota            | Componente             | Descrição |
|----------------|------------------------|-----------|
| `/`            | `Home.tsx`              | Lista todos os produtos |
| `/add`         | `EditProduct.tsx`       | Adiciona um novo produto |
| `/edit/:id`    | `EditProduct.tsx`       | Edita um produto existente |

---

## 🛠️ Principais Dependências

| Pacote              | Descrição |
|--------------------|-----------|
| `react`           | Biblioteca principal do frontend |
| `react-router-dom` | Gerenciamento de rotas |
| `axios`           | Consumo da API REST |
| `@mui/material`   | Estilização e componentes UI |
