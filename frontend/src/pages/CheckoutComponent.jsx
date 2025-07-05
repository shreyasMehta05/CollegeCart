import React from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Example checkout function within a component:
const CheckoutComponent = ({ cart, user }) => {
  const navigate = useNavigate();

  const checkout = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error("You must be logged in to checkout.");
        return;
      }

      // Send the order creation request.
      const response = await axios.post(
        'http://localhost:5000/api/orders',
        {
          items: cart.map(item => ({
            product: item.product._id,
            quantity: item.quantity
          })),
          // The totalAmount is computed in the backend,
          // but we still send it for reference if needed.
          totalAmount: cart.reduce((total, item) => total + item.product.price * item.quantity, 0),
          deliveryAddress: {
            hostel: user.hostel,
            roomNumber: user.roomNumber
          }
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      // Check if the order was successfully created.
      if (response.data.success) {
        // Display the OTP received in the response.
        toast.success(`Order created successfully! OTP: ${response.data.otp}`);
        // Navigate to the orders page.
        navigate('/orders');
      } else {
        toast.error("Failed to create order.");
      }
    } catch (error) {
      // Show an error toast if the request fails.
      toast.error(error.response?.data?.message || "Error creating order");
    }
  };

  return (
    <div>
      <button onClick={checkout}>Checkout</button>
      {/* Include ToastContainer once in your app */}
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default CheckoutComponent;
