import React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';
// import { ToastContainer, toast } from 'react-toastify';
// import './assets/css/ReactToastify.css';

import { NotificationContainer } from "react-notifications";
import 'react-notifications/lib/notifications.css';
import { UseWalletProvider } from "use-wallet";
import BlockchainProvider from "./context";
import Home from './pages/Home';

function App() {
	return (
		<UseWalletProvider
			chainId={3}
			connectors={{
				portis: { dAppId: "nft-minting" },
			}}>
			<BlockchainProvider>	
				<BrowserRouter>
					<Switch>
						<Route exact path="/" component={Home}></Route>
						<Route exact path="/home" component={Home}></Route>
						<Route path="*" component={Home}></Route>
					</Switch>
					{/* <ToastContainer /> */}
					<NotificationContainer />
				</BrowserRouter>
			</BlockchainProvider>
		</UseWalletProvider>
	)
}

export default App;
