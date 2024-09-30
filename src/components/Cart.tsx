import React, { useContext, useState } from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  DrawerContent,
  Button,
  Box,
  Text,
  Divider,
} from '@chakra-ui/react';
import BigNumber from 'bignumber.js';
import { CartContext } from '../contexts/CartContext';
import PaymentWindow from './PaymentWindow';

interface CartProps {
  isOpen: boolean;
  onClose: () => void;
}

const Cart: React.FC<CartProps> = ({ isOpen, onClose }) => {
  const cartContext = useContext(CartContext);
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);

  if (!cartContext) {
    throw new Error('Cart must be used within a CartProvider');
  }

  const { cartItems, removeFromCart, setCartItems } = cartContext;

  const totalAmount: BigNumber = new BigNumber(cartItems.reduce((total, item) => total + item.price, 0));

  const handleCheckout = () => {
    setIsPaymentOpen(true);
  };

  const handlePaymentComplete = (success: boolean) => {
    setIsPaymentOpen(false);
    if (success) {
      // Handle successful payment
      setCartItems([]); // Clear the cart
      onClose();
      alert('Payment Successful!');
    } else {
      // Handle payment failure
      alert('Payment Failed or Timed Out.');
    }
  };

  return (
    <>
      <Drawer isOpen={isOpen} placement="right" onClose={onClose} size="sm">
        <DrawerOverlay />
        <DrawerContent>
          <DrawerHeader>Your Cart</DrawerHeader>
          <DrawerBody>
            {cartItems.length === 0 ? (
              <Text>No items in cart</Text>
            ) : (
              cartItems.map((item) => (
                <Box key={item.id} mb={4}>
                  <Text fontWeight="bold">{item.name}</Text>
                  <Text>{item.price} SOL</Text>
                  <Button
                    mt={2}
                    size="sm"
                    colorScheme="red"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </Button>
                  <Divider my={2} />
                </Box>
              ))
            )}
          </DrawerBody>
          <DrawerFooter flexDirection="column" alignItems="flex-start">
            <Text fontWeight="bold">Total: {totalAmount.toFixed(2)} SOL</Text>
            <Button
              mt={4}
              colorScheme="green"
              width="100%"
              onClick={handleCheckout}
              isDisabled={cartItems.length === 0}
            >
              Checkout
            </Button>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      {isPaymentOpen && (
        <PaymentWindow
          amount={totalAmount}
          cartItems={cartItems}
          onPaymentComplete={handlePaymentComplete}
          onClose={() => setIsPaymentOpen(false)}
        />
      )}
    </>
  );
};

export default Cart;
