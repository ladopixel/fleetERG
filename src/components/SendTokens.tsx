import React, { useState, ChangeEvent } from 'react';

import { 
    Alert,
    AlertIcon,
    Button,
    FormControl,
    FormLabel,
    Input ,
    Link,
    NumberInputField,
    NumberInput,
    NumberInputStepper,
    NumberIncrementStepper,
    NumberDecrementStepper,
    Stack,
    VStack,
} from '@chakra-ui/react'

import { OutputBuilder, TransactionBuilder } from "@fleet-sdk/core";

declare global {
  interface Window {
    ergoConnector: any;
  }
}
declare var ergo: any;
var connected: any;

function SendTokens() {

    const [wallet, setWallet] = useState<string>('');
    const [tokenID, setTokenID] = useState<string>('');
    const [amount, setAmount] = useState<number>(1);

    const [sent, setSent] = useState(false);
    const [tx, setTx] = useState('...');


    const handleTokenNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setWallet(event.target.value);
    }

    const handleTokenIDChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTokenID(event.target.value);
    }

    const handleAmountChange = (valueAsString: string, valueAsNumber: number) => {
        setAmount(valueAsNumber);
    }

    const handleSubmit = () => {
        create_token(wallet, amount, tokenID)
    }

    async function create_token(wallet: string, amount: any, tokenID: any): Promise<void> { 
        connected = await window.ergoConnector.nautilus.connect(); 
        if (connected) {
          const height = await ergo.get_current_height();
          const unsignedTx = new TransactionBuilder(height)
            .from(await ergo.get_utxos())
            .to(
              new OutputBuilder(
                "1000000", wallet
              )
            .addTokens({ 
                tokenId: tokenID,
                amount: amount, 
              })
            )
            .sendChangeTo(await ergo.get_change_address())
            .payMinFee()
            .build()
            .toEIP12Object();
          const signedTx = await ergo.sign_tx(unsignedTx);
          const txId = await ergo.submit_tx(signedTx);
          setTx(txId);
          setSent(true)
        }
    }

    return (
        <>

            <FormControl>
                <Stack spacing={3}>

                    <FormLabel>Destination wallets</FormLabel>
                    <Input 
                        placeholder='Enter destination wallet' 
                        size='md' 
                        value={wallet}
                        onChange={handleTokenNameChange}
                        />

                    <FormLabel>Token ID</FormLabel>
                    <Input 
                        placeholder='Enter token ID' 
                        size='md' 
                        value={tokenID}
                        onChange={handleTokenIDChange}
                        />
                    
                    <FormLabel>Amount</FormLabel>
                    <NumberInput 
                        min={1} 
                        value={amount} 
                        onChange={handleAmountChange}
                        precision={1} step={1} >
                        <NumberInputField />
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>

                        
                    <Button colorScheme='teal' variant='outline' onClick={handleSubmit}> 
                        Send
                    </Button>
                    
                    
                    {sent && (
                        <VStack>
                            <Alert status='success' variant='solid'>
                                <AlertIcon />
                                Tokens sent successfully!
                            </Alert>

                            <Link href={`https://explorer.ergoplatform.com/en/transactions/${tx}`} isExternal>
                                {tx}
                            </Link>
                        </VStack>
                    )}

                </Stack>
            </FormControl>

            
        </>
    );
};

export default SendTokens;