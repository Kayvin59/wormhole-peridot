import { useState, useContext, useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Header.module.scss";
import ExternalLink from "../../common/links/ExternalLink.js";
import InternalLink from "../../common/links/InternalLink.js";
import { WindowWidthContext } from "../../../components-helper/contexts/WindowWidthProvider.js";
import Background from "../../common/others/Background.js";
import Logo from "../../common/others/Logo.js";
import ChainDropdown from "./ChainDropdown.js";
import ConnectButton from "./ConnectButton.js";
import MenuButton from "./MenuButton.js";
import { conc, cond, getCssVariablePixel } from "../../../lib/wrapper/html.js";

export default function Header() {
  const mobileBreakpoint = getCssVariablePixel("--mobile-breakpoint-very-big");

  const location = useLocation();

  const windowWidth = useContext(WindowWidthContext);

  const [isChecked, setIsChecked] = useState(false);

  // ---- HOOKS ----

  useEffect(() => {
    resetBackground();
  }, [location]);

  useEffect(() => {
    if (isChecked === true && windowWidth > mobileBreakpoint) {
      setIsChecked(false);
    }
  }, [windowWidth]);

  // ---- FUNCTIONS ----

  function resetBackground() {
    setIsChecked(false);
  }

  return windowWidth > mobileBreakpoint ? (
    <header className={conc(styles.header, styles.header_desktop)}>
      <div className={styles.logo_container}>
        <Logo />
      </div>

      <nav className={styles.nav_desktop}>
        <InternalLink
          link={"/bridge"}
          otherClasses={conc(styles.link, styles.link_desktop)}
          activeClasses={styles.link_active}
          onClick={resetBackground}
        >
          Bridge
        </InternalLink>
        <InternalLink
          link={"/peridot-swap"}
          otherClasses={conc(styles.link, styles.link_desktop)}
          activeClasses={styles.link_active}
          onClick={resetBackground}
        >
          Peridot-Swap
        </InternalLink>
        <InternalLink
          link={"/ifo"}
          otherClasses={conc(styles.link, styles.link_desktop)}
          activeClasses={styles.link_active}
          onClick={resetBackground}
        >
          IFO
        </InternalLink>
        <InternalLink
          link={"/inventory"}
          otherClasses={conc(styles.link, styles.link_desktop)}
          activeClasses={styles.link_active}
          onClick={resetBackground}
        >
          Inventory
        </InternalLink>
        <ExternalLink
          link={"https://faucets.chain.link/arbitrum-sepolia"}
          otherClasses={conc(styles.link, styles.link_desktop)}
          onClick={resetBackground}
        >
          Faucet
        </ExternalLink>
      </nav>

      <div className={styles.function_container}>
        <ConnectButton />
        <ChainDropdown />
      </div>
    </header>
  ) : (
    <header className={conc(styles.header, styles.header_mobile)}>
      <Background isActive={isChecked} onClick={() => resetBackground()} />

      <Logo />

      <MenuButton getter={isChecked} setter={setIsChecked} />

      <nav
        className={conc(
          styles.nav_mobile,
          cond(isChecked, styles.nav_mobile_visible),
        )}
      >
        <InternalLink
          link={"/bridge"}
          otherClasses={conc(styles.link, styles.link_mobile)}
          activeClasses={styles.link_active}
          onClick={resetBackground}
        >
          Bridge
        </InternalLink>
        <InternalLink
          link={"/peridot-swap"}
          otherClasses={conc(styles.link, styles.link_mobile)}
          activeClasses={styles.link_active}
          onClick={resetBackground}
        >
          Peridot-Swap
        </InternalLink>
        <InternalLink
          link={"/ifo"}
          otherClasses={conc(styles.link, styles.link_mobile)}
          activeClasses={styles.link_active}
          onClick={resetBackground}
        >
          IFO
        </InternalLink>
        <InternalLink
          link={"/inventory"}
          otherClasses={conc(styles.link, styles.link_mobile)}
          activeClasses={styles.link_active}
          onClick={resetBackground}
        >
          Inventory
        </InternalLink>

        <hr />

        <ExternalLink
          link={"https://faucets.chain.link/arbitrum-sepolia"}
          otherClasses={conc(styles.link, styles.link_mobile)}
          onClick={resetBackground}
        >
          Faucet
        </ExternalLink>

        <hr />

        <div className={styles.function_container}>
          <ConnectButton />
          <ChainDropdown />
        </div>
      </nav>
    </header>
  );
}
