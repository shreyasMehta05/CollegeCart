// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import { ProtectedRoute } from './utils/auth';

import Navbar from './components/layout/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Products from './pages/Products';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import OrderHistory from './pages/OrderHistory';
import SellerDashboard from './pages/SellerDashboard';
import TransactionHistory from './pages/TransactionHistory';
import Profile from './pages/Profile';
import AddProduct from './pages/AddProduct';
import Support from './pages/Support';
import ItemDetails from './pages/ItemDetails';
import DeliveryItems from './pages/DeliveryItems';
import './global.css';
function App() {
    return (
        <ThemeProvider>
            <AuthProvider>
                <Router>
                    <Navbar />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route 
                            path="/profile" 
                            element={
                                <ProtectedRoute>
                                    <Profile />
                                </ProtectedRoute>
                            } 
                        />
                        <Route path="/products" element={<Products />} />
                        {/* <Route path="/products/:id" element={<ProductDetails />} /> */}
                        <Route path="/product/:productId" element={<ItemDetails />} />
                        <Route
                            path="/cart"
                            element={
                                <ProtectedRoute>
                                    <Cart />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/pending-deliveries"
                            element={
                                <ProtectedRoute>
                                    < DeliveryItems/>
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/orders"
                            element={
                                <ProtectedRoute>
                                    <OrderHistory />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/seller/dashboard"
                            element={
                                <ProtectedRoute>
                                    <SellerDashboard />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/transactions"
                            element={
                                <ProtectedRoute>
                                    <TransactionHistory />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/add-product"
                            element={
                                <ProtectedRoute>
                                    <AddProduct />
                                </ProtectedRoute>
                            }
                        />
                        <Route
                            path="/support"
                            element={
                                <ProtectedRoute>
                                    <Support />
                                </ProtectedRoute>
                            }
                        />
                    </Routes>
                    <ToastContainer />
                </Router>
            </AuthProvider>
        </ThemeProvider>
    );
}

export default App;
