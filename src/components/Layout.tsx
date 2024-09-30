import React, { useState } from 'react';
import { Box, Grid, Heading, Button } from '@chakra-ui/react';
import ProductCard from './ProductCard';
import Cart from './Cart';

interface Product {
  id: number;
  name: string;
  price: number;
}

const products: Product[] = [
  { id: 1, name: 'Product 1', price: 0.5 },
  { id: 2, name: 'Product 2', price: 0.7 },
  // Add more products as needed
];

const Layout: React.FC = () => {
  const [isCartOpen, setIsCartOpen] = useState(false);

  return (
    <Box p={4}>
      <Heading mb={6}>Products</Heading>
      <Grid templateColumns="repeat(auto-fill, minmax(200px, 1fr))" gap={6}>
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </Grid>
      <Button
        position="fixed"
        top="20px"
        right="20px"
        colorScheme="teal"
        onClick={() => setIsCartOpen(true)}
      >
        Cart
      </Button>
      <Cart isOpen={isCartOpen} onClose={() => setIsCartOpen(false)} />
    </Box>
  );
};

export default Layout;
