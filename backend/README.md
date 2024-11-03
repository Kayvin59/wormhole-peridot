# Peridot Wormhole

## Overview

This repository contains the Peridot Wormhole contracts.

## Explanation

The Peridot Wormhole contracts are responsible for sending and receiving FFTs across chains from the source chain Ethereum to other chains. It is also possible to participate in the IFO on Ethereum from other chains while the IFO runs.

These contracts also allow for users to bridge their ERC20 Fractions to other chains.

## Testing Instructions

### Use Contracts.

To participate in a Crosschain IFO users will have to call `sendMessage` on the `WormholeIFO.sol` contract. This will send the cost of the IFO plus he Wormhole costs into the contract, the user then has the ability to use `claimWrappedFTTs` after the IFO has ended to gain their Wrapped FTT's.

The `FTTSourceBridge.sol` & `FTTDestinationBridge.sol` allow users to bridge their FTT's or Wrapped FTT's by calling the `sendMessage` function.

### New Deployment

Don't forget to set your env & the proper contract addresses in the deployment scripts. In addition `WormholeDeployDestination.s.sol` & `setRegisteredSenderDestination.s.sol` have to be deployed/called on a different chain then then the other contracts. In our example we have used Arbitrum Sepolia as the Source Chain and Base Sepolia as the Destination Chain.

Deploy `DeployPeridotComplete.s.sol -> WormholeDeployDestination.s.sol -> setPeridotFactory.s.sol -> createCollection.s.sol -> setMiniNFT.s.sol -> setRegisteredSender.s.sol -> setRegisteredSenderDestination.s.sol`

On the Mini NFT Contract, you can `startNewRound` and later `closeRound` if the round is done. The mini NFT has to `sendMessage` to the `WormholeIFO` contracts after a round has started to communicate to te other chains, the price and which FTT belongs to the Mini NFT.

## New Contracts

- `WormholeIFO`: The Wormhole IFO contract allows users to participate in the IFO on Ethereum from other chains. Itcan and needs to be contacted from Ethereum that a) saleIsOpen is true and b) that the Price Quoter has given the PriceReceiver the price for the blind box. After the IFO is closed the user can claim their FTT tokens but not their Blindboxes.

- `IFOPriceQuoter`: The IFOPriceQuoter contract is used to get the price of the blind box from the IFOPriceReceiver.

- `IFOPriceReceiver`: The IFOPriceReceiver contract is used to get the price of the current blind box sale and sends the price automatically to the IFOPriceQuoter.

- `FTTSourceBridge`: The FTTSourceBridge contract not only unlocks tokens and bridges them to other Chains to the FTTDestinationBridge but is also curcial for the IFO participation from the non SourceChain. It gets the MiniNFT's after the IFO is closed and turns them into FTT.

- `FTTDestinationBridge`: The FTTDestinationBridge contract is used to bridge FTT from the SourceChain to the DestinationChain and vice versa. It burns the FTT on the DestinationChain when the FTT are bridged back to the SourceChain and mints new FTT on the Destination Chain. It gets these abilities through the `DestinationChainFactory` contract.

- `DestinationChainFactory`: The DestinationChainFactory contract is not only used to mint and burn new tokens for the FTTDestinationBridge but it also gets the information about newly deployed FTT Tokens from the PeridotTokenFactory and creates a wrapped version of them.

- `Wrapped FTT`: The Wrapped FTT contract is the ERC20 version of the FTT token.

### Interfaces

- `IDestinationChainFactory`: The IDestinationChainFactory interface.

- `IIFOPriceQuoter`: The IIFOPriceQuoter interface.

- `IIFOPriceReceiver`: The Interface for the IFOPrice Receiver.

## Improved Contracts

- `PeridotTokenFactory`: The PeridotTokenFactory contract is used to deploy new FTT & MiniNFT
  Tokens and their respective Collection. It now also sends a payload to a DestinationChainFactory to let it know a new Collection has been created which creates the wrapped version of an FTT.

- `PeridotMiniNFT`: The PeridotMiniNFT contract is the Blindbox & MiniNFT contract, it also holds the IFO functions. It is important that the MiniNFT contract also sends a payload to the WormholeIFO contract that the sale is open and also when it is closed. It mints the corsschain blindboxes after the sale is closed to MiniNFTs and sends them to the FTTSourceBridge.
