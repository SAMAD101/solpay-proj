import React, { useState, useEffect, useRef } from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  Text,
  Box,
  Image
} from '@chakra-ui/react';
import {
  createQR,
  encodeURL,
  validateTransfer,
  TransferRequestURLFields,
  findReference,
} from '@solana/pay';
import BigNumber from 'bignumber.js';
import {
  PublicKey,
  Keypair,
  Connection,
  clusterApiUrl,
} from '@solana/web3.js';
import { QRCodeCanvas } from 'qrcode.react';

interface Product {
  id: number;
  name: string;
  price: number;
}

interface PaymentWindowProps {
  amount: BigNumber;
  cartItems: Product[];
  onPaymentComplete: (success: boolean) => void;
  onClose: () => void;
}

const PaymentWindow: React.FC<PaymentWindowProps> = ({
  amount,
  cartItems,
  onPaymentComplete,
  onClose,
}) => {
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds countdown
  const [solanaUrl, setSolanaUrl] = useState<string>('');
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'completed' | 'failed'>(
    'pending'
  );

  useEffect(() => {
    const recipient = new PublicKey('5pzEpTgNU1NPEnL6JV3YrbAL2BkjjrTQ4JbbjJJmyyhE'); // Replace with your wallet address
    const label = 'Purchase';
    const message = 'Thank you for your purchase!';
    const memo = 'Order1234'; // Optional: For tracking

    // Generate a unique reference
    const reference = new Keypair().publicKey;

    const urlParams: TransferRequestURLFields = {
      recipient,
      amount,
      reference,
      label,
      message,
      memo,
    };

    const solanaUrlInstance = encodeURL(urlParams);
    console.log('Solana Pay URL:', solanaUrlInstance.toString());
    setSolanaUrl(solanaUrlInstance.toString());

    // Create a connection to the Solana cluster
    const connection = new Connection(clusterApiUrl('mainnet-beta')); // Use 'devnet' if testing

    // Start countdown
    const countdownTimer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === 1) {
          clearInterval(countdownTimer);
          clearInterval(paymentCheckInterval);
          onPaymentComplete(false);
        }
        return prev - 1;
      });
    }, 1000);

    // Payment monitoring logic
    const checkPayment = async () => {
      try {
        const signatureInfo = await findReference(connection, reference, {
            finality: "confirmed",
        });
        console.log('Transaction found:', signatureInfo.signature);

        try {
            await validateTransfer(connection, signatureInfo.signature, {
              recipient,
              amount,
            });
          } catch (error) {
            clearInterval(paymentCheckInterval);
            console.error("Payment validation failed", error);
            setPaymentStatus("failed");
          }

        // Payment successful
        clearInterval(countdownTimer);
        setPaymentStatus('completed');
        onPaymentComplete(true);
      } catch (error) {
        console.error("Transaction not fround: ", error);
      }
    };

    const paymentCheckInterval = setInterval(checkPayment, 5000); // Check every 5 seconds

    return () => {
      clearInterval(countdownTimer);
      clearInterval(paymentCheckInterval);
    };
  }, [amount, onPaymentComplete]);

  return (
    <Modal isOpen={true} onClose={onClose} size="md" isCentered>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader textAlign="center">Complete Your Payment</ModalHeader>
        <ModalBody>
          {paymentStatus === 'pending' && (
            <>
              <Text textAlign="center" mb={4}>
                Complete your payment within {timeLeft} seconds
              </Text>
              <Box display="flex" justifyContent="center" mb={4}>
                {solanaUrl ? (
                  <QRCodeCanvas value={solanaUrl} size={256} />
                ) : (
                  <Text>Loading...</Text>
                )}
              </Box>
            </>
          )}
          {paymentStatus === 'completed' && (
            <Text color="green" textAlign="center">
              Payment Successful!
            </Text>
          )}
          {paymentStatus === 'failed' && (
            <Text color="red" textAlign="center">
              Payment Failed or Timed Out.
            </Text>
          )}
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default PaymentWindow;
