import { useState, useEffect, useContext, useRef } from "react";
import { CiCircleCheck } from "react-icons/ci";
import styles from "./IFO.module.scss";
import { BalancesContext } from "../../../components-helper/contexts/BalancesProvider.js";
import { ConnectionContext } from "../../../components-helper/contexts/ConnectionProvider.js";
import useIsFormOkay from "../../../components-helper/hooks/useIsFormOkay.js";
import SectionContainer from "../../structure/SectionContainer.js";
import Section from "../../structure/Section.js";
import Form from "../../common/form/Form.js";
import ExternalLink from "../../common/links/ExternalLink.js";
import Modal from "../../common/modals/Modal.js";
import BalanceTooltip from "../../common/tokens/BalanceTooltip.js";
import ProgressBar from "./components/ProgressBar.js";
import {
  getBlindBoxBalance,
  getUserBlindBoxes,
  getBlindBoxCount,
} from "../../../lib/web3/web3BaseAdd.js";
import { mintBlindBox } from "../../../lib/web3/web3IFO.js";
import { isDefined } from "../../../lib/helper.js";

import { getCollection } from "../../../data/collections.js";
import { getToken } from "../../../data/tokens.js";

export default function IFO() {
  const chain = "ARB";
  const collection = getCollection(chain, "BAYC");
  const payToken = getToken(chain, "ETH");
  const payToken2 = getToken("BASE", "ETH");

  const [availableCount, setAvailableCount] = useState(undefined);

  const [payTokenBalance, setPayTokenBalance] = useState(undefined);
  const [blindBoxBalance, setBlindBoxBalance] = useState(undefined);

  const [mintAmount, setMintAmount] = useState(0);
  const [mintPrice, setMintPrice] = useState(0);

  const [isMintProcessing, setIsMintProcessing] = useState(false);
  const [isMintModalOpen, setMintModalOpen] = useState(false);

  const { balances, getBalance, updateBalances } = useContext(BalancesContext);
  const { isConnected, connectedChain } = useContext(ConnectionContext);

  const mintFormRef = useRef(null);
  const isMintFormOkay = useIsFormOkay(mintFormRef);
  const [mintExtraText, setMintExtraText] = useState("DEFAULT");

  // ---- HOOKS ----

  useEffect(() => {
    refreshMiniNftCount();
  }, [collection]);

  useEffect(() => {
    refreshTokenBalance();
  }, [balances]);

  useEffect(() => {
    refreshBlindBoxBalance();
  }, [isConnected, connectedChain]);

  useEffect(() => {
    refreshMintPrice();
  }, [mintAmount]);

  // ---- HOOKS (VALIDITY) ----

  useEffect(() => {
    refreshMintValidity();
  }, [isMintFormOkay, mintAmount]);

  // ---- FUNCTIONS ----

  function refreshMiniNftCount() {
    getBlindBoxCount(
      chain,
      collection.miniNft.contract,
      collection.blindBoxId,
    ).then((result) => {
      setAvailableCount(result);
    });
  }

  function refreshTokenBalance() {
    if (isDefined(balances, connectedChain)) {
      let tokenBalance = undefined;

      if (connectedChain === "ARB") {
        tokenBalance = getBalance(payToken);
      } else {
        tokenBalance = getBalance(payToken2);
      }

      setPayTokenBalance(tokenBalance);
    }
  }

  function refreshBlindBoxBalance() {
    if (isConnected === true) {
      if (connectedChain === "ARB") {
        getBlindBoxBalance(
          collection.chain.nameId,
          collection.miniNft.contract,
          collection.blindBoxId,
        ).then((result) => {
          setBlindBoxBalance(result);
        });
      } else {
        getUserBlindBoxes(collection.miniNft.contract).then((result) => {
          setBlindBoxBalance(result);
        });
      }
    }
  }

  function refreshMintPrice() {
    let newPrice =
      mintAmount > 0 ? collection.price.slice(0, -1) + mintAmount : "0";

    setMintPrice(newPrice);
  }

  // ---- FUNCTIONS (VALIDITY) ----

  function refreshMintValidity() {
    if (isMintFormOkay) {
      if (mintAmount > 0) {
        setMintExtraText("");
      } else {
        setMintExtraText("you need to increase the mint amount");
      }
    }
  }

  // ---- FUNCTIONS (FORM LOADING) ----

  function isFormLoading() {
    return !isDefined(balances);
  }

  // ---- FUNCTIONS (CLICK HANDLERS) ----

  function closeModal() {
    updateBalances();

    refreshMiniNftCount();
    refreshBlindBoxBalance();
    setMintAmount(0);

    setMintModalOpen(false);
  }

  function increaseMintAmount() {
    if (collection.maxAmount !== undefined) {
      if (mintAmount >= collection.maxAmount) {
        setMintAmount(collection.maxAmount);
      } else {
        setMintAmount(mintAmount + 1);
      }
    }
  }

  function decreaseMintAmount() {
    if (mintAmount < 2) {
      setMintAmount(0);
    } else {
      setMintAmount(mintAmount - 1);
    }
  }

  function handleMint() {
    setIsMintProcessing(true);

    mintBlindBox(collection.miniNft.contract, mintAmount, mintPrice)
      .then(() => {
        setMintModalOpen(true);
      })
      .finally(() => {
        setIsMintProcessing(false);
      });
  }

  return (
    <SectionContainer>
      <Section title={"Initial Fraction Offering"}>
        <div className={styles.container}>
          <div className={styles.image_container}>
            <div className={styles.image_inner_container}>
              <img
                src={collection.blindBoxImagePath}
                alt={collection.name + " Blind Box"}
                className={styles.image}
              />
              <ExternalLink link={collection.marketLink}>
                See on OpenSea
              </ExternalLink>
            </div>

            <div className={styles.image_price}>
              <span>Price:</span>
              <span>
                <BalanceTooltip balance={collection.price} /> {payToken.symbol}
              </span>
            </div>
          </div>

          <div className={styles.bar} />

          <div className={styles.form_container}>
            <div className={styles.title}>
              Mint Blind Box - {collection.name}
            </div>

            <div className={styles.description}>
              <p>Fundraise for the {collection.name} Mini NFT</p>
              <p>
                Mint a Blind Box and exchange it 1:1 to a Mini NFT after the IFO
                ends
              </p>
              <p>
                1 {collection.name} Mini NFT represents 1/{collection.maxAmount}{" "}
                of a {collection.name}
              </p>
              <p>
                1 Peridot ERC20 Fraction represents 1/{collection.maxAmount} of
                a Mini NFT
              </p>
            </div>

            <div className={styles.contract}>
              <div>Contract Address</div>
              <div>{collection.miniNft.contract}</div>
            </div>

            <div className={styles.info_container}>
              <div className={styles.available_container}>
                <ProgressBar
                  value={availableCount}
                  max={collection.maxAmount}
                />
                <div className={styles.available_text_container}>
                  <span>
                    {collection.maxAmount - availableCount}/
                    {collection.maxAmount} available
                  </span>
                  <span>
                    you own <BalanceTooltip balance={blindBoxBalance} />
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.button_container}>
              <div className={styles.pay_container}>
                <div className={styles.counter_container}>
                  <span
                    className={styles.counter_button}
                    onClick={decreaseMintAmount}
                  >
                    -
                  </span>
                  <span className={styles.counter}>{mintAmount}</span>
                  <span
                    className={styles.counter_button}
                    onClick={increaseMintAmount}
                  >
                    +
                  </span>
                </div>

                <div className={styles.price_container}>
                  <div>Pay:</div>
                  <div>
                    <BalanceTooltip balance={mintPrice} /> {payToken.symbol}
                  </div>
                </div>
                <div className={styles.price_container}>
                  <div>Balance:</div>
                  <div>
                    <BalanceTooltip balance={payTokenBalance} />{" "}
                    {payToken.symbol}
                  </div>
                </div>
              </div>

              <Form
                ref={mintFormRef}
                handler={handleMint}
                text={"Mint"}
                currentValue={payTokenBalance}
                minValue={mintPrice}
                isLoading={isFormLoading()}
                isProcessing={isMintProcessing}
                extraText={mintExtraText}
              />
            </div>
          </div>
        </div>

        <Modal isOpen={isMintModalOpen} close={closeModal}>
          <div className={styles.mint_modal_container}>
            <CiCircleCheck size={80} />

            <div className={styles.mint_modal_text_container}>
              <p>Congratulations on your</p>
              <p>
                {collection.name} x{mintAmount}
              </p>
              <p>
                Price: <BalanceTooltip balance={mintPrice} /> {payToken.symbol}
              </p>
            </div>
          </div>
        </Modal>
      </Section>
    </SectionContainer>
  );
}
