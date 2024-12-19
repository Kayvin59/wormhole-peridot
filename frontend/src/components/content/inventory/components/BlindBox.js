import { useState, useEffect, useContext, useRef } from "react";
import styles from "./BlindBox.module.scss";
import { BalancesContext } from "../../../../components-helper/contexts/BalancesProvider.js";
import { ConnectionContext } from "../../../../components-helper/contexts/ConnectionProvider.js";
import useIsFormOkay from "../../../../components-helper/hooks/useIsFormOkay.js";
import Form from "../../../common/form/Form.js";
import ExternalLink from "../../../common/links/ExternalLink.js";
import BalanceTooltip from "../../../common/tokens/BalanceTooltip.js";
import {
  getBlindBoxBalance,
  getUserBlindBoxes,
} from "../../../../lib/web3/web3BaseAdd.js";
import {
  isRoundFinished,
  claimBlindBox,
} from "../../../../lib/web3/web3Inventory.js";

export default function BlindBox({ collection, refreshLists }) {
  const [balance, setBalance] = useState(undefined);

  const [isClaimProcessing, setIsClaimProcessing] = useState(false);

  const { updateBalances } = useContext(BalancesContext);
  const { isConnected, connectedChain } = useContext(ConnectionContext);

  const claimFormRef = useRef(null);
  const isClaimFormOkay = useIsFormOkay(claimFormRef);
  const [claimExtraText, setClaimExtraText] = useState("DEFAULT");

  // ---- HOOKS ----

  useEffect(() => {
    refreshBalance();
  }, [isConnected, connectedChain]);

  // ---- HOOKS (VALIDITY) ----

  useEffect(() => {
    refreshClaimValidity();
  }, [isClaimFormOkay]);

  // ---- FUNCTIONS ----

  function refreshBalance() {
    if (isConnected === true) {
      if (connectedChain === "ARB") {
        getBlindBoxBalance(
          collection.chain.nameId,
          collection.miniNft.contract,
          collection.blindBoxId,
        ).then((result) => {
          setBalance(result);
        });
      } else {
        getUserBlindBoxes(collection.miniNft.contract).then((result) => {
          setBalance(result);
        });
      }
    }
  }

  // ---- FUNCTIONS (VALIDITY) ----

  function refreshClaimValidity() {
    if (isClaimFormOkay) {
      isRoundFinished(
        collection.chain.nameId,
        collection.miniNft.contract,
        collection.maxAmount,
      ).then((result) => {
        if (result) {
          setClaimExtraText("");
        } else {
          setClaimExtraText("the round is not finished yet");
        }
      });
    }
  }

  // ---- FUNCTIONS (CLICK HANDLERS) ----

  function handleClaim() {
    setIsClaimProcessing(true);

    claimBlindBox(collection.miniNft.contract, collection.blindBoxId)
      .then(() => {
        updateBalances();
        refreshLists();
      })
      .finally(() => {
        setIsClaimProcessing(false);
      });
  }

  return (
    <div className={styles.container}>
      <div>
        <div className={styles.chain_text}>(on {collection.chain.nameId})</div>

        <div className={styles.image_container}>
          <img
            src={collection.blindBoxImagePath}
            alt={collection.name + " Blind Box"}
            className={styles.image}
          />
        </div>

        <div className={styles.balance_container}>
          <span>
            Your Balance: <BalanceTooltip balance={balance} />
          </span>
          {connectedChain === "BASE" && (
            <span>
              which are stored in the bridge contract and available after the
              IFO ends
            </span>
          )}
        </div>
      </div>

      <div className={styles.button_container}>
        <Form
          ref={claimFormRef}
          handler={handleClaim}
          text={"Claim Blind Boxes"}
          chain={collection.chain}
          currentValue={balance}
          isMinEqual={false}
          isProcessing={isClaimProcessing}
          extraText={claimExtraText}
        />

        <div className={styles.link_container}>
          <ExternalLink link={collection.marketLink} isButton={true}>
            Sell in Market
          </ExternalLink>
        </div>
      </div>
    </div>
  );
}
