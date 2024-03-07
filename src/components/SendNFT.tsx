import React, { useState, ChangeEvent } from 'react';

import { 
    Alert,
    AlertIcon,
    Button,
    FormControl,
    FormLabel,
    Input ,
    Link,
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


function SendNFT() {

    const [wallet, setWallet] = useState<string>('');
    const [tokenID, setTokenID] = useState<string>('');

    const [sent, setSent] = useState(false);
    const [tx, setTx] = useState('...');


    const handleTokenNameChange = (event: ChangeEvent<HTMLInputElement>) => {
        setWallet(event.target.value);
    }

    const handleTokenIDChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTokenID(event.target.value);

    }

    const handleSubmit = () => {
        create_token(wallet, tokenID)
    }

    async function create_token(wallet: string, tokenID: any): Promise<void> { 
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
                amount: "1", 
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

                    <FormLabel>Destination wallet</FormLabel>
                    <Input 
                        placeholder='Enter destination wallet' 
                        size='md' 
                        value={wallet}
                        onChange={handleTokenNameChange}
                        />

                    <FormLabel>NFT ID</FormLabel>
                    <Input 
                        placeholder='Enter NFT ID' 
                        size='md' 
                        value={tokenID}
                        onChange={handleTokenIDChange}
                        />
                        
                    <Button colorScheme='teal' variant='outline' onClick={handleSubmit}> 
                        Send
                    </Button>
                    
                    
                    {sent && (
                        <VStack>
                            <Alert status='success' variant='solid'>
                                <AlertIcon />
                                NFT sent successfully!
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

export default SendNFT;