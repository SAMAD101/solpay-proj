import React, { useContext } from 'react';
import { Box, Button, Text } from '@chakra-ui/react';
import { CartContext } from '../contexts/CartContext';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const cartContext = useContext(CartContext);

  if (!cartContext) {
    throw new Error('ProductCard must be used within a CartProvider');
  }

  const { cartItems, addToCart, removeFromCart } = cartContext;

  const isInCart = cartItems.some((item) => item.id === product.id);

  const handleButtonClick = () => {
    if (isInCart) {
      removeFromCart(product.id);
    } else {
      addToCart(product);
    }
  };

  return (
    <Box p={4} borderWidth="1px" borderRadius="lg" textAlign="center">
      <Text mt={2} fontWeight="bold">
        {product.name}
      </Text>
      <Text>{product.price} SOL</Text>
      <Button
        mt={4}
        colorScheme={isInCart ? 'red' : 'teal'}
        onClick={handleButtonClick}
      >
        {isInCart ? 'Remove from Cart' : 'Add to Cart'}
      </Button>
    </Box>
  );
};

export default ProductCard;
