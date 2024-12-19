import { useState, useEffect, useContext } from "react";
import { FaArrowRightArrowLeft, FaArrowRightLong } from "react-icons/fa6";
import WormholeConnect from "@wormhole-foundation/wormhole-connect";
import styles from "./Bridge.module.scss";
import SectionContainer from "../../structure/SectionContainer.js";
import Section from "../../structure/Section.js";
import Form from "../../common/form/Form.js";
import NumberInput from "../../common/form/NumberInput.js";
import ExternalLink from "../../common/links/ExternalLink.js";
import Modal from "../../common/modals/Modal.js";
import BalanceTooltip from "../../common/tokens/BalanceTooltip.js";
import { BalancesContext } from "../../../components-helper/contexts/BalancesProvider.js";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import { bridge } from "../../../lib/web3/web3Bridge.js";
import { isDefined } from "../../../lib/helper.js";

import { projectName } from "../../../data/project.js";
import { getToken } from "../../../data/tokens.js";

export default function Bridge() {
  const bridgeTokenSymbol = "FFT";

  const config = {
    network: "Testnet",
    chains: ["ArbitrumSepolia", "BaseSepolia"],
    rpcs: {
      ArbitrumSepolia:
        "https://endpoints.omniatech.io/v1/arbitrum/sepolia/public",
      BaseSepolia: "https://base-sepolia.gateway.tenderly.co",
    },
    ui: {
      showHamburgerMenu: false,
    },
    tokens: ["ETHarbitrum_sepolia", "ETHbase_sepolia"],
  };

  const theme = {
    mode: "dark",
    input: "#1a1a1a",
    primary: "#ffffff",
    secondary: "#ffffff",
    text: "#ffffff",
    textSecondary: "#ffffff",
    error: "#ffffff",
    success: "#ffffff",
    badge: "#ffffff",
    font: "Poppins Regular",
  };

  const [bridgeToken, setBridgeToken] = useState(undefined);

  const [bridgeAmount, setBridgeAmount] = useState("");
  const [bridgeBalance, setBridgeBalance] = useState(undefined);
  const [bridgeTransactionHash, setBridgeTransactionHash] = useState(undefined);
  const [isBridgeProcessing, setIsBridgeProcessing] = useState(false);
  const [isBridgeModalOpen, setIsBridgeModalOpen] = useState(false);

  const { balances, getBalance, updateBalances } = useContext(BalancesContext);
  const { isConnected, connectedChain, supportedChain } =
    useContext(ConnectionContext);

  // ---- HOOKS ----

  useEffect(() => {
    refreshBridgeToken();
  }, [supportedChain]);

  useEffect(() => {
    refreshBridgeTokenBalance();
  }, [balances, bridgeToken]);

  // ---- FUNCTIONS ----

  function refreshBridgeToken() {
    if (isDefined(supportedChain)) {
      let token = getToken("ARB", bridgeTokenSymbol);

      setBridgeToken(token);
    }
  }

  function refreshBridgeTokenBalance() {
    if (isDefined(balances, bridgeToken)) {
      let tokenBalance = getBalance(bridgeToken);

      setBridgeBalance(tokenBalance);
    }
  }

  // ---- FUNCTIONS (CLICK HANDLERS) ----

  function closeModal() {
    updateBalances();
    setBridgeTransactionHash(undefined);
    setIsBridgeModalOpen(false);
  }

  function handleBridge() {
    setIsBridgeProcessing(true);

    bridge(bridgeAmount)
      .then((result) => {
        console.log(result);
        setBridgeTransactionHash("test");
        setIsBridgeModalOpen(true);
      })
      .finally(() => {
        setIsBridgeProcessing(false);
      });
  }

  // ---- FUNCTIONS (HTML ELEMENTS) ----

  function getTransactionLink() {
    let baseLink = "https://wormholescan.io/#/tx/";
    let link = baseLink + bridgeTransactionHash;

    return link;
  }

  return (
    <SectionContainer>
      <Section title={"Wormhole Bridge"}>
        <div className={styles.wormhole_container}>
          <WormholeConnect config={config} theme={theme} />
        </div>
      </Section>

      <Section title={"Peridot Bridge"}>
        <Modal isOpen={isBridgeModalOpen} close={closeModal}>
          <div className={styles.bridge_modal_container}>
            <span>See your transaction on </span>
            <ExternalLink link={getTransactionLink()}>
              wormholescan
            </ExternalLink>
          </div>
        </Modal>

        <div className={styles.bridge_container}>
          {isConnected ? (
            connectedChain === "ARB" ? (
              <div className={styles.info_container}>
                <img
                  className={styles.info_chain_image}
                  src={"/images/chains/ARB.svg"}
                  alt={"ARB chain for " + projectName}
                />
                <FaArrowRightLong />
                <img
                  className={styles.info_chain_image}
                  src={"/images/chains/BASE.svg"}
                  alt={"BASE chain for " + projectName}
                />
              </div>
            ) : (
              <div className={styles.info_container}>
                <img
                  className={styles.info_chain_image}
                  src={"/images/chains/BASE.svg"}
                  alt={"BASE chain for " + projectName}
                />
                <FaArrowRightLong />
                <img
                  className={styles.info_chain_image}
                  src={"/images/chains/ARB.svg"}
                  alt={"ARB chain for " + projectName}
                />
              </div>
            )
          ) : (
            <div className={styles.info_container}>
              <img
                className={styles.info_chain_image}
                src={"/images/chains/ARB.svg"}
                alt={"ARB chain for " + projectName}
              />
              <FaArrowRightArrowLeft />
              <img
                className={styles.info_chain_image}
                src={"/images/chains/BASE.svg"}
                alt={"BASE chain for " + projectName}
              />
            </div>
          )}

          <Form
            handler={handleBridge}
            text={"Bridge your " + bridgeTokenSymbol}
            isProcessing={isBridgeProcessing}
          >
            <NumberInput
              getter={bridgeAmount}
              setter={setBridgeAmount}
              label={
                <span>
                  {bridgeTokenSymbol} Balance:{" "}
                  <BalanceTooltip balance={bridgeBalance} />
                </span>
              }
              isProcessing={isBridgeProcessing}
              decimals={bridgeToken?.decimals}
              max={bridgeBalance}
              balance={bridgeBalance}
            />
          </Form>
        </div>
      </Section>
    </SectionContainer>
  );
}
