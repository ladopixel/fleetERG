import React, { useState, useEffect } from 'react';

import { 
    Badge,
    Box, 
    Divider,
    HStack, 
    Text,
    useToast,
    VStack,
} from '@chakra-ui/react'

import Token from '../components/Token';


declare global {
  interface Window {
    ergoConnector: any;
  }
}

declare var ergo: any;
var connected: any;

interface Token {
    tokenId: string;
    balance: number;
  }

function Header() {

    const toast = useToast()
    const id = 'id-toast'

    const [Connect, setConnect] = useState<boolean>(false);
    const [Height, setHeight] = useState<number>(0);
    const [Wallet, setWallet] = useState<string>('');
    const [TotalERG, setTotalERG] = useState<number>(0);
    const [Tokens, setTokens] = useState<Token[]>([]);
    const [infoTokens, setInfoTokens] = useState<JSX.Element[] | undefined>(undefined);

    useEffect(() => {
        const fetchData = async () => {
            await info_wallet();
        };

        fetchData();
    }, []);

    useEffect(() => {
        const listaTokens = Tokens.map((token, index) => (
          <Box key={index} fontSize={'medium'}>
            <Text>Token ID: {token.tokenId}</Text>
            <Text>Balance: {token.balance}</Text>
            <Divider />
          </Box>
          
        ));

        setInfoTokens(listaTokens);
      }, [Tokens]); // Dependencia en Tokens
      

    async function info_wallet(): Promise<void> { 
        connected = await window.ergoConnector.nautilus.connect(); 
        if (connected) {
            setConnect(true);
            setTotalERG(await ergo.get_balance("ERG"));
            const tokens = await ergo.get_balance("all");
            setTokens(tokens);
            setWallet(await ergo.get_change_address());
            setHeight(await ergo.get_current_height());
            
            if (!toast.isActive(id)) {
                toast({
                    id: 'init',
                    title: 'IMPORTANT!!!!',
                    description: "Remember to always check the connector before signing your transaction.",
                    status: 'warning',
                    duration: 9000,
                    position: 'top',
                    isClosable: true,
                }) 
            }
        } else { 
            setConnect(false);
        }
    }


    return (
        <>
            {Connect ? (
                <Box textAlign={'left'}>
                    <Box>
                        <HStack mb={5}>
                            <Badge variant='solid' colorScheme='green' mr={2}>
                                Connected
                            </Badge>
                            <Badge variant='solid' colorScheme='blue' mr={2}>
                                {TotalERG / 1000000000} ERG
                            </Badge>
                            <Badge>
                                {Wallet}
                            </Badge>
                        </HStack>
                    </Box>
                    
                    {/* <Text>Height: {Height}</Text> */}
                    {infoTokens}
                </Box>

            ) : (
                <Box textAlign={'left'}>
                    <Badge variant='solid' colorScheme='red' mr={2}>
                        Disconnected
                    </Badge>
                </Box>
            )}
        </>
    );
};

export default Header;
