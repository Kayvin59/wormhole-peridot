import { BalancesProvider } from "../../../components-helper/contexts/BalancesProvider.js";
import Main from "../../structure/Main.js";
import Inventory from "./Inventory.js";

export default function InventoryContainer() {
	return (
		<Main>
			<BalancesProvider>
				<Inventory/>
			</BalancesProvider>
		</Main>
	);
}