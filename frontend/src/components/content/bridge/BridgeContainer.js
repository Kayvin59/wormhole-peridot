import { BalancesProvider } from "../../../components-helper/contexts/BalancesProvider.js";
import Main from "../../structure/Main.js";
import Bridge from "./Bridge.js";

export default function BridgeContainer() {
	return (
		<Main>
			<BalancesProvider>
				<Bridge/>
			</BalancesProvider>
		</Main>
	);
}