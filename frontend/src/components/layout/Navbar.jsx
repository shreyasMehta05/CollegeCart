// src/components/layout/Navbar.js
import React, { useState } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Box,
  Menu,
  MenuItem,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  Grow,
  GlobalStyles,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ShoppingCart,
  Person,
  Store,
  History,
  AddCircle,
  Logout,
  Login,
  Home,
  ShoppingBag,
  Support,
  Close,
  Brightness4,
  Brightness7,
} from '@mui/icons-material';
import { Link, useNavigate, useLocation } from 'react-router-dom';

// Import MUI theme hook as useMuiTheme
import { useTheme as useMuiTheme } from '@mui/material/styles';
// Import our custom theme context hook (renamed to avoid collision)
import { useTheme as useAppTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const { mode, toggleTheme } = useAppTheme();
  const muiTheme = useMuiTheme();
  const isMobile = useMediaQuery(muiTheme.breakpoints.down('md'));
  const navigate = useNavigate();
  const location = useLocation();

  const [anchorEl, setAnchorEl] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleMobileMenuToggle = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  const handleLogout = () => {
    logout();
    handleMenuClose();
    navigate('/login');
  };

  const navItems = [
    { label: 'Home', path: '/', icon: <Home /> },
    { label: 'Products', path: '/products', icon: <ShoppingBag /> },
  ];

  const authenticatedItems = [
    { label: 'Support', path: '/support', icon: <Support /> },
    { label: 'Cart', path: '/cart', icon: <ShoppingCart /> },
    { label: 'Orders', path: '/orders', icon: <History /> },
    { label: 'Seller Dashboard', path: '/seller/dashboard', icon: <Store /> },
    // { label: 'Add Product', path: '/add-product', icon: <AddCircle /> },
  ];

  return (
    <>
      <GlobalStyles
        styles={{
          '@keyframes glitter': {
            '0%': {
              boxShadow:
                '0 0 4px rgba(99, 102, 241, 0.4), 0 0 8px rgba(99, 102, 241, 0.3), 0 0 12px rgba(99, 102, 241, 0.2)',
            },
            '50%': {
              boxShadow:
                '0 0 8px rgba(99, 102, 241, 0.5), 0 0 16px rgba(99, 102, 241, 0.4), 0 0 24px rgba(99, 102, 241, 0.3)',
            },
            '100%': {
              boxShadow:
                '0 0 4px rgba(99, 102, 241, 0.4), 0 0 8px rgba(99, 102, 241, 0.3), 0 0 12px rgba(99, 102, 241, 0.2)',
            },
          },
        }}
      />
      <AppBar
        position="sticky"
        elevation={4}
        sx={{
          background:
            mode === 'dark'
              ? 'linear-gradient(90deg, #1a1c2e, #2d3748)'
              : 'linear-gradient(90deg, #f8fafc, #e2e8f0)',
          color: mode === 'dark' ? '#fff' : '#1e293b',
          borderBottom: `1px solid ${mode === 'dark' ? '#2d3748' : '#e2e8f0'}`,
          py: 1,
        }}
      >
        <Toolbar>
          {/* Mobile menu icon */}
          {isMobile && (
            <IconButton
              color="inherit"
              edge="start"
              onClick={handleMobileMenuToggle}
              sx={{
                mr: 1,
                '&:hover': {
                  backgroundColor:
                    mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)',
                },
              }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo/Title */}
          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{
              flexGrow: 1,
              textDecoration: 'none',
              color: 'inherit',
              fontWeight: 600,
              '&:hover': {
                color: mode === 'dark' ? '#818cf8' : '#4f46e5',
              },
              transition: 'color 0.2s ease',
            }}
          >
            IIIT Marketplace
          </Typography>

          {/* Navigation Items */}
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton
              onClick={toggleTheme}
              sx={{
                mr: 1,
                color: 'inherit',
                '&:hover': {
                  backgroundColor:
                    mode === 'dark'
                      ? 'rgba(255, 255, 255, 0.05)'
                      : 'rgba(0, 0, 0, 0.05)',
                  color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                },
              }}
            >
              {mode === 'dark' ? <Brightness7 /> : <Brightness4 />}
            </IconButton>

            {!isMobile && (
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                {navItems.map((item) => (
                  <Button
                    key={item.path}
                    color="inherit"
                    component={Link}
                    to={item.path}
                    startIcon={item.icon}
                    sx={{
                      ml: 2,
                      textTransform: 'none',
                      fontWeight:
                        location.pathname === item.path ? '600' : '400',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                        transform: 'translateY(-2px)',
                        backgroundColor: 'transparent',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: '100%',
                          height: '2px',
                          bottom: 0,
                          left: 0,
                          background:
                            mode === 'dark'
                              ? 'linear-gradient(90deg, #818cf8, #6366f1)'
                              : 'linear-gradient(90deg, #4f46e5, #6366f1)',
                          animation: 'glitter 1.5s ease infinite',
                        },
                      },
                    }}
                  >
                    {item.label}
                  </Button>
                ))}

                {/* Authenticated items with the same styling */}
                {user &&
                  authenticatedItems.map((item) => (
                    <Button
                      key={item.path}
                      color="inherit"
                      component={Link}
                      to={item.path}
                      startIcon={item.icon}
                      sx={{
                        ml: 2,
                        textTransform: 'none',
                        fontWeight:
                          location.pathname === item.path ? '600' : '400',
                        position: 'relative',
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                          transform: 'translateY(-2px)',
                          backgroundColor: 'transparent',
                          '&::after': {
                            content: '""',
                            position: 'absolute',
                            width: '100%',
                            height: '2px',
                            bottom: 0,
                            left: 0,
                            background:
                              mode === 'dark'
                                ? 'linear-gradient(90deg, #818cf8, #6366f1)'
                                : 'linear-gradient(90deg, #4f46e5, #6366f1)',
                            animation: 'glitter 1.5s ease infinite',
                          },
                        },
                      }}
                    >
                      {item.label}
                    </Button>
                  ))}

                {/* Profile/Login button */}
                {user ? (
                  <IconButton
                    onClick={handleProfileMenuOpen}
                    sx={{
                      ml: 2,
                      color: 'inherit',
                      '&:hover': {
                        backgroundColor:
                          mode === 'dark'
                            ? 'rgba(255, 255, 255, 0.05)'
                            : 'rgba(0, 0, 0, 0.05)',
                        color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                      },
                    }}
                  >
                    <Person />
                  </IconButton>
                ) : (
                  <Button
                    component={Link}
                    to="/login"
                    startIcon={<Login />}
                    sx={{
                      ml: 2,
                      textTransform: 'none',
                      color: 'inherit',
                      position: 'relative',
                      overflow: 'hidden',
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        color: mode === 'dark' ? '#818cf8' : '#4f46e5',
                        transform: 'translateY(-2px)',
                        backgroundColor: 'transparent',
                        '&::after': {
                          content: '""',
                          position: 'absolute',
                          width: '100%',
                          height: '2px',
                          bottom: 0,
                          left: 0,
                          background:
                            mode === 'dark'
                              ? 'linear-gradient(90deg, #818cf8, #6366f1)'
                              : 'linear-gradient(90deg, #4f46e5, #6366f1)',
                          animation: 'glitter 1.5s ease infinite',
                        },
                      },
                    }}
                  >
                    Login
                  </Button>
                )}
              </Box>
            )}
          </Box>
        </Toolbar>
      </AppBar>

      {/* Profile Menu */}
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleMenuClose}
        keepMounted
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        PaperProps={{
          sx: {
            bgcolor: mode === 'dark' ? '#1a1c2e' : '#ffffff',
            borderRadius: '8px',
            boxShadow:
              mode === 'dark'
                ? '0 4px 6px -1px rgba(0, 0, 0, 0.3), 0 2px 4px -1px rgba(0, 0, 0, 0.24)'
                : '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
          },
        }}
      >
        <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate('/profile');
          }}
        >
          Profile 
        </MenuItem>
        {/* <MenuItem
          onClick={() => {
            handleMenuClose();
            navigate('/transactions');
          }}
        >
          Transactions
        </MenuItem> */}
        <Divider />
        <MenuItem onClick={handleLogout}>Logout <Logout sx={{ ml: 1 }} />
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        anchor="left"
        open={mobileMenuOpen}
        onClose={handleMobileMenuToggle}
        sx={{
          '& .MuiDrawer-paper': {
            width: 280,
            bgcolor: mode === 'dark' ? '#1a1c2e' : '#ffffff',
            color: mode === 'dark' ? '#fff' : '#1e293b',
          },
        }}
      >
        <Box
          sx={{
            p: 2,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${mode === 'dark' ? '#2d3748' : '#e2e8f0'}`,
          }}
        >
          <Typography variant="h6" component="div">
            IIIT Marketplace
          </Typography>
          <IconButton onClick={handleMobileMenuToggle}>
            <Close />
          </IconButton>
        </Box>
        <List>
          {navItems.map((item) => (
            <ListItem
              button
              key={item.path}
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.label} />
            </ListItem>
          ))}
          {user &&
            authenticatedItems.map((item) => (
              <ListItem
                button
                key={item.path}
                component={Link}
                to={item.path}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>{item.icon}</ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItem>
            ))}
        </List>
        <Divider />
        <List>
          {user ? (
            <>
              <ListItem button onClick={() => navigate('/profile')}>
                <ListItemIcon>
                  <Person />
                </ListItemIcon>
                <ListItemText primary="Profile" />
              </ListItem>
              <ListItem button onClick={handleLogout}>
                <ListItemIcon>
                  <Logout />
                </ListItemIcon>
                <ListItemText primary="Logout" />
              </ListItem>
            </>
          ) : (
            <ListItem button onClick={() => navigate('/login')}>
              <ListItemIcon>
                <Login />
              </ListItemIcon>
              <ListItemText primary="Login" />
            </ListItem>
          )}
        </List>
      </Drawer>
    </>
  );
};

export default Navbar;
