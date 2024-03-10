import * as React from "react"

import {
  Box,
  ChakraProvider,
  Grid,
  Tab, 
  Tabs, 
  TabList, 
  TabPanel, 
  TabPanels, 
  theme,
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"

import BurnTokens from './components/BurnTokens';
import Create from './components/Create';
import Header from "./components/MyWallet";
import SendErg from './components/SendErg';
import SendNFT from './components/SendNFT';
import SendTokens from './components/SendTokens';

export const App = () => (
  
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid p={3}>
          <ColorModeSwitcher justifySelf="flex-end" />
          <Tabs>
            <TabList>
              <Tab> My wallet</Tab>
              <Tab> Create token</Tab>
              <Tab> Send ERG</Tab>
              <Tab> Send tokens</Tab>
              <Tab> Send NFT</Tab>
              <Tab> 🔥 Burn tokens</Tab>
            </TabList>
            <TabPanels>
              <TabPanel>
                <Header />
              </TabPanel>
              <TabPanel>
                <Create />
              </TabPanel>
              <TabPanel>
                <SendErg />
              </TabPanel>
              <TabPanel>
                <SendTokens />
              </TabPanel>
              <TabPanel>
                <SendNFT />
              </TabPanel>
              <TabPanel>
                <BurnTokens />
              </TabPanel>
            </TabPanels>
          </Tabs>
      </Grid>
    </Box>
  </ChakraProvider>
)
