// src/pages/TransactionHistory.js
import React, { useState, useEffect } from 'react';
import {
    Container,
    Paper,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TablePagination,
    Chip,
    Box,
    CircularProgress,
    Alert
} from '@mui/material';
import axios from 'axios';

const TransactionHistory = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await axios.get('/api/transactions');
            setTransactions(response.data.transactions || []); // Ensures transactions is always an array
        } catch (error) {
            setError('Error fetching transactions');
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const getStatusColor = (status) => {
        const colors = {
            completed: 'success',
            pending: 'warning',
            failed: 'error',
            refunded: 'info'
        };
        return colors[status] || 'default';
    };

    if (loading) return <CircularProgress />;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            <Typography variant="h4" gutterBottom>
                Transaction History
            </Typography>

            <Paper sx={{ width: '100%', overflow: 'hidden' }}>
                <TableContainer>
                    <Table stickyHeader>
                        <TableHead>
                            <TableRow>
                                <TableCell>Transaction ID</TableCell>
                                <TableCell>Date</TableCell>
                                <TableCell>Order ID</TableCell>
                                <TableCell>Amount</TableCell>
                                <TableCell>Payment Method</TableCell>
                                <TableCell>Status</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {Array.isArray(transactions) && transactions
                                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((transaction) => (
                                    <TableRow key={transaction._id}>
                                        <TableCell>{transaction.transactionId}</TableCell>
                                        <TableCell>
                                            {new Date(transaction.createdAt).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>{transaction.order}</TableCell>
                                        <TableCell>₹{transaction.amount}</TableCell>
                                        <TableCell>{transaction.paymentMethod}</TableCell>
                                        <TableCell>
                                            <Chip
                                                label={transaction.status}
                                                color={getStatusColor(transaction.status)}
                                                size="small"
                                            />
                                        </TableCell>
                                    </TableRow>
                                ))}
                        </TableBody>
                    </Table>
                </TableContainer>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component="div"
                    count={transactions.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onPageChange={handleChangePage}
                    onRowsPerPageChange={handleChangeRowsPerPage}
                />
            </Paper>
        </Container>
    );
};

export default TransactionHistory;
