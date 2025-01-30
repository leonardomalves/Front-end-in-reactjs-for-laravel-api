import React from "react";
import { AppBar, Toolbar, IconButton, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import { Home, AddCircleOutline } from "@mui/icons-material"; // Ícones do Material UI

const Navbar: React.FC = () => {
  return (
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Sistema de Produtos
          </Typography>
          <IconButton color="inherit" component={Link} to="/">
            <Home />
          </IconButton>
          <IconButton color="inherit" component={Link} to="/add">
            <AddCircleOutline />
          </IconButton>
        </Toolbar>
      </AppBar>
  );
};

export default Navbar;
