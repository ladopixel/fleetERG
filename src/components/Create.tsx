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

import Title from '../components/Title';

declare global {
  interface Window {
    ergoConnector: any;
  }
}
declare var ergo: any;
var connected: any;


function Create() {

    const [tokenName, setTokenName] = useState('');
    const [tokenDescription, setTokenDescription] = useState('');
    const [amount, setAmount] = useState(1);
    const [decimals, setDecimals] = useState(0);

    const [created, setCreated] = useState(false);
    const [tx, setTx] = useState('...');


    const handleTokenNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTokenName(event.target.value);
    }

    const handleTokenDescriptionChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTokenDescription(event.target.value);
    }

    const handleAmountChange = (valueAsString: string, valueAsNumber: number) => {
        setAmount(valueAsNumber);
    }
    
    const handleDecimalsChange = (valueAsString: string, valueAsNumber: number) => {
        setDecimals(valueAsNumber);
    }

    const handleSubmit = () => {
        create_token(tokenName, tokenDescription, amount, decimals)
    }

    async function create_token(name: string, description: string, amount: any, decimals: any): Promise<void> { 
        connected = await window.ergoConnector.nautilus.connect(); 
        if (connected) {
          const height = await ergo.get_current_height();
          const unsignedTx = new TransactionBuilder(height)
            .from(await ergo.get_utxos())
            .to(
              new OutputBuilder(
                "1000000", "9gBYZrMRNX66uN5VhLnTw6absspsarXPxcWSi5fuE5EesBfQC6s"
              )
              .mintToken({ 
                amount: amount,
                name: name,
                decimals: decimals,
                description: description
                })
            )
            .sendChangeTo(await ergo.get_change_address())
            .payMinFee()
            .build()
            .toEIP12Object();
          const signedTx = await ergo.sign_tx(unsignedTx);
          const txId = await ergo.submit_tx(signedTx);
          setTx(txId);
          setCreated(true)
        }
    }

    return (
        <>
            <Title title='Create token'/>

            <FormControl>
                <Stack spacing={3}>

                    <FormLabel>Token name</FormLabel>
                    <Input 
                        placeholder='Enter token name' 
                        size='md' 
                        value={tokenName}
                        onChange={handleTokenNameChange}
                        />

                    <FormLabel>Token description</FormLabel>
                    <Input 
                        placeholder='Enter token description' 
                        size='md' 
                        value={tokenDescription}
                        onChange={handleTokenDescriptionChange} />
                    
                    <FormLabel>Amount</FormLabel>
                    <NumberInput min={1} value={amount} onChange={handleAmountChange}>
                        <NumberInputField />
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>

                    <FormLabel>Decimals</FormLabel>
                    <NumberInput min={0} value={decimals} onChange={handleDecimalsChange}>
                        <NumberInputField />
                        <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                        </NumberInputStepper>
                    </NumberInput>

                        
                    <Button colorScheme='teal' variant='outline' onClick={handleSubmit}> 
                        Create token
                    </Button>
                    
                    
                    {created && (
                        <VStack>
                            <Alert status='success' variant='solid'>
                                <AlertIcon />
                                Token successfully created!
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

export default Create;