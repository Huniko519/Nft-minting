import React, {
    createContext,
    useContext,
    useReducer,
    useMemo,
    useEffect,
} from "react";
import { ethers } from "ethers";
/* import { useWallet } from "use-wallet"; */
/* import {
    nftContract, provider
} from "../contracts"; */

import { NotificationManager } from "react-notifications";


const BlockchainContext = createContext();

export function useBlockchainContext() {
    return useContext(BlockchainContext);
}

function reducer(state, { type, payload }) {
    return {
        ...state,
        [type]: payload,
    };
}

const INIT_STATE = {
    signer: "",
    provider: "",
    totalSupply: 10000,
    price: 0.03,
    maxCount: 3000,
};

export default function Provider({ children }) {
    /* const wallet = useWallet(); */
    const [state, dispatch] = useReducer(reducer, INIT_STATE);

    // set signer balance
    // useEffect(() => {
    //     const getSigner = async () => {
    //         if (wallet.status === "connected") {
    //             const provider = new ethers.providers.Web3Provider(
    //                 wallet.ethereum
    //             );
    //             const signer = await provider.getSigner();
    //             console.log('signer ' + signer)
    //             dispatch({
    //                 type: "provider",
    //                 payload: provider,
    //             });
    //             dispatch({
    //                 type: "signer",
    //                 payload: signer,
    //             });
    //         }
    //     };
    //     getSigner();
    // }, [wallet.status]);

    // useEffect(() => {
    //     if (state.signer !== "") {
    //         if (wallet.status === "connected") {
    //             // checkInfos();
    //         }
    //     }
    // }, [state.signer]);

    // const checkInfos = async () => {
    //     try {
    //         var signedNFTContract = nftContract.connect(state.signer);

    //         var userAddress = await state.signer.getAddress();
    //         var totalSupply = fromBigNum(await signedNFTContract.totalSupply(), 0);
    //         dispatch({
    //             type: "totalSupply",
    //             payload: totalSupply
    //         });
    //     } catch (err) {
    //         // console.log(err);
    //         NotificationManager.error("Check Info error");
    //         dispatch({
    //             type: "totalSupply",
    //             payload: 0
    //         });
    //     }
    // }

    // //actions
    

    return (
        <BlockchainContext.Provider
            value={useMemo(
                () => [
                    state,
                    {
                        /* buy */
                    }
                ],
                [state]
            )}>
            {children}
        </BlockchainContext.Provider>
    );
}
