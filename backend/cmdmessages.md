HubToken:
forge create --rpc-url $ARBITRUM_SEPOLIA_URL --private-key $PRIVATE_KEY src/HubToken.sol:HubToken --constructor-args Testtoken TEST --verify --etherscan-api-key $ARBISCAN

forge create --rpc-url $SEPOLIA_URL --private-key $PRIVATE_KEY --constructor-args Peertoken PEER 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9 0xF450B38cccFdcfAD2f98f7E4bB533151a2fB00E9 --verify --etherscan-api-key $ETHERSCAN src/PeerToken.sol:PeerToken

forge script script/DeployPeer.s.sol --rpc-url $AMOY_URL --verify --etherscan-api-key $POLYGONSCAN --broadcast

forge script script/WormholeDeployDestination.s.sol --rpc-url https://base-sepolia.g.alchemy.com/v2/Wb-qwqnC_yZRQOAAs7PCjISOT7xYgcuN --verify --etherscan-api-key Z9RCDJXNHUCJ6RJDVMF8UUHNCWPRZ7VGK8 --broadcast

forge script script/DeployPeridotFactory.s.sol --rpc-url https://arb-sepolia.g.alchemy.com/v2/YW4THm0GBtkHu5w_a4encLrqervum3Xf --libraries "src/library/PeridotFFTHelper.sol:PeridotFFTHelper:0x305b5Cf667Dd4A5c517c0f42e140307528a50326" "src/library/PeridotMiniNFTHelper.sol:PeridotMiniNFTHelper:0xaB5bD8A5ba030beCf69889BEef3FcC8c0aD1EfE3" --verify --etherscan-api-key JGDUNUJG123RQG3F2WHH6R1J95Q5BHCSXB --broadcast

forge verify-contract 0x6EeAac2a256b760615a5164449C3FC0998fEdBb5 \
 src/fundraising/PeridotMiniNFT.sol:PeridotMiniNFT \
 --chain arbitrum-sepolia \
 --compiler-version 0.8.27 \
 --constructor-args "$(cast abi-encode "constructor(string,address)" "ipfs://bafybeiadtdjbr6nd6ogtbjcy56oh2ymaxhw5djjdrl2zvhgngir2s3dqiq" 0x7B1bD7a6b4E61c2a123AC6BC2cbfC614437D0470)" \
 --etherscan-api-key JGDUNUJG123RQG3F2WHH6R1J95Q5BHCSXB
