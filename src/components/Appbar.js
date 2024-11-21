import React, { useState, useEffect } from 'react';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link, useNavigate, useLocation } from 'react-router-dom';

export default function ButtonAppBar(props) {

    const navigate = useNavigate();
    //const [balance, setBalance] = React.useState('0')
    const token = localStorage.getItem('token');

    const logout = () => {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
    }

    const location = useLocation();

    if (location.pathname === "/") {
        return null
    }

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="p" component="div" sx={{ flexGrow: 1 }}>
                        {localStorage.getItem("user")}
                    </Typography>
                    <Link className="btn btn-outline-info disabled">Balance: {props.balance}</Link>
                    <Button className="btn btn-danger" onClick={logout} color="inherit">
                        Logout
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ ml: 1 }}
                        >
                            <LogoutIcon />
                        </IconButton>
                    </Button>
                </Toolbar>
            </AppBar>
        </Box>
    );
}