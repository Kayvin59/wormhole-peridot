import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import styles from "./Main.module.scss";
import CookieForm from "../common/others/CookieForm.js";
import { ConnectionProvider } from "../../components-helper/contexts/ConnectionProvider.js";
import { WindowWidthProvider } from "../../components-helper/contexts/WindowWidthProvider.js";
import Header from "./header/Header.js";
import Footer from "./Footer.js";
import { scrollToAnchor } from "../../lib/wrapper/html.js";

export default function Main({children}) {
	const scrollDelay = 1500;

	const location = useLocation();

	useEffect(() => {
		const timeoutId = setTimeout(() => {
			scrollToAnchor();
		}, scrollDelay);
	
		return () => clearTimeout(timeoutId);
	}, [location]);

	return (
		<ConnectionProvider>
			<WindowWidthProvider>
				<Header/>
				
				<main className={styles.main}>											
					{children}
				</main>

				<CookieForm/>

				<Footer/>
			</WindowWidthProvider>
		</ConnectionProvider>
	);
}