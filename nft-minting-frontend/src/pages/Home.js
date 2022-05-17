import React from 'react'
import './home.scss'
import { tips, copyToClipboard, NF, call } from '../util'
import { ethers } from "ethers";
import slide1 from '../assets/img/slide1.gif';
import slide2 from '../assets/img/slide2.gif';
import slide3 from '../assets/img/slide3.gif';
import slide4 from '../assets/img/slide4.gif';
import slide5 from '../assets/img/slide5.gif';
import slide6 from '../assets/img/slide6.gif';
import gifius from '../assets/img/gifius.gif';
import { NotificationManager } from "react-notifications";

import { useWallet } from "use-wallet";
import { useBlockchainContext } from "../context";
import Config from '../config/v1.json'
import abi from '../config/abi.json'
const Home = () => {
    const [state] = useBlockchainContext();
	const [status, setStatus] = React.useState({
		value : 1, 
        isLoading : false,
        mint1 : 10,
        mint2 : 300
	})
	const updateStatus = (params) => setStatus({...status, ...params}) 
    const wallet = useWallet()

    const mint_nft = async () => {
        try {
            if (wallet.status !== "connected") {
                wallet.connect()
            } else {
                const url = process.env.REACT_APP_PROXY + "/get-buy-params"
                const response = await call("/get-buy-params", {count:status.value})
                if (response) {
                    const { tokens, price, signature } = response.msg
                    const provider = new ethers.providers.Web3Provider(wallet.ethereum);
                    const signer = await provider.getSigner()
                    const contract = new ethers.Contract(Config.contract, abi, provider);
                    const BigNumber = ethers.BigNumber
                    const value = BigNumber.from(tokens.length).mul(BigNumber.from(price)).toHexString()
                    const tx = await contract.connect(signer).buy(tokens, price, signature, { value })
                    console.log(tx)
                    await tx.wait();
                }
            }
        } catch (error) {
            console.log(error)
        }
    }

    return (
        <>
            <div className='home-back'>
                <div className='slide-panel'>
                    <img src={slide1} ></img>
                    <img src={slide2} ></img>
                    <img src={slide3} ></img>
                    <img src={slide4} ></img>
                    <img src={slide5} ></img>
                    <img src={slide6} ></img>
                </div>
                <div className='mint-panel'>
                    <div className='mint-container' >
                        <div className='row center'>
                            <b>Special Price for Discord Members</b>
                        </div>
                        <div className='row center'>
                            <b>March 10 - 2AM EST</b>
                        </div>
                        <div className='row mt1'>
                            <div className='col-4'>
                                <p className='text-center m0 p0'>Supply</p>
                                <b className='text-center m0 p0'>{state.totalSupply}</b>
                            </div>
                            <div className='col-4'>
                                <p className='text-center m0 p0'>Price</p>
                                <b className='text-center m0 p0'>{state.price} ETH</b>
                            </div>
                            <div className='col-4'>
                                <p className='text-center m0 p0'>Max</p>
                                <b className='text-center m0 p0'>{state.maxCount} PER WALLET</b>
                            </div>
                        </div>

                        <div className='mint-card'>
                            <h1>BOUND SALE</h1>
                            <div className='price-pan'>
                                <img src={gifius} />
                                <div>
                                    <span className='block' style={{ fontSize: '14px', margin: '6px' }}>Price Per NFT</span>
                                    <b>{state.price} ETH Each</b>
                                </div>
                            </div>
                            <div className='price-setting-pan'>
                                <div>
                                    <span className='setting-btn' onClick={() => { updateStatus({ value: status.value - 1 > 0 ? status.value - 1 : 1 }) }}>-</span>
                                    <b style={{ fontSize: '1.2rem' }}>{status.value}</b>
                                    <span className='setting-btn' onClick={() => { updateStatus({ value: status.value + 1 < state.maxCount ? status.value + 1 : state.maxCount }) }}>+</span>
                                </div>
                                <button className='mint-btn' onClick={() => { updateStatus({ value: state.maxCount }) }}>SET MAX</button>
                            </div>
                            <div className='total-pan'>
                                <label>Total</label>
                                <label>{NF(state.price * status.value, 3)} ETH</label>
                            </div>
                            <div className='row center'>
                                <button className='mint-btn' style={{ height: '35px', width: '100px' }} disabled={status.isLoading} onClick={() => {mint_nft() }}>
                                    <b>{ wallet.status==="connected" ? (status.isLoading ? 'Minting...' : 'Mint NFT') : 'Connect Wallet'}</b>
                                </button>
                            </div>
                            <div className='row center mt2'>
                                <label>{status.mint1}/{status.mint2}</label>
                            </div>
                            { wallet.account!==null && (
                                <div className='row center mt2'>
                                    <label>{ wallet.account }</label>
                                </div>
                            )  }
                        </div>
                    </div>
                </div>
            </div>

        </>
    )
};

export default Home;