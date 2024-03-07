import * as React from "react"

import {
  ChakraProvider,
  Box,
  Grid,
  theme,
  Tabs, TabList, TabPanels, Tab, TabPanel
} from "@chakra-ui/react"
import { ColorModeSwitcher } from "./ColorModeSwitcher"

import Create from './components/Create';
import SendErg from './components/SendErg';
import SendTokens from './components/SendTokens';
import SendNFT from './components/SendNFT';
import BurnTokens from './components/BurnTokens';

export const App = () => (
  <ChakraProvider theme={theme}>
    <Box textAlign="center" fontSize="xl">
      <Grid p={3}>
        <ColorModeSwitcher justifySelf="flex-end" />
        
        <Tabs>
          <TabList>
            <Tab>Create token</Tab>
            <Tab>Send ERG</Tab>
            <Tab>Send tokens</Tab>
            <Tab>Send NFT</Tab>
            <Tab>Burn tokens</Tab>
          </TabList>

          <TabPanels>
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
