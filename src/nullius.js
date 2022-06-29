import React, { Component } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import WalletConnect from '@walletconnect/client';

import Web3 from 'web3/dist/web3.min.js';
import { getCurrentWalletConnected, subscribe } from './helpers/Web3';
import { getInfo } from './helpers/WalletConnect';

import abis from 'erc-abis';

export * from './components';

import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/app.scss';

const WalletContext = React.createContext();
export const connector = new WalletConnect({ bridge: 'https://bridge.walletconnect.org' });

//TODO: refractor

export class Provider extends Component {
    static contextType = WalletContext;
    constructor(props) {
        super(props);
        this.state = { using: 'MetaMask', connector, loading: true, contracts: {}, chainId: props.chainId };
        this.refreshWallet = this.refreshWallet.bind(this);

        if (window.ethereum) {
            if (!this.state.web3) {
                this.state.web3 = new Web3(window.ethereum);
                if (!this.subscription) {
                    if (this.props.verbose) {
                        console.log('Subscribed to newBlockHeaders');
                    }
                    //TODO: remove web3 (use rpc subscription)
                    this.subscription = this.state.web3.eth.subscribe('newBlockHeaders', async (error, event) => {
                        if (this.props.verbose) {
                            console.log('newBlockHeaders[', window.ethereum.chainId, '][', event.number, ']');
                        }
                        this.refreshWallet();
                    });
                }
            }
            subscribe('connect', async (data) => {
                const wallet = await getCurrentWalletConnected();
                this.setState({ using: 'MetaMask', wallet, loading: false });
            });
            if (window.ethereum.selectedAddress) {
                this.state.wallet = {
                    address: window.ethereum.selectedAddress,
                    chainId: Web3.utils.hexToNumber(window.ethereum.chainId)
                };
            }
            window.ethereum.on('accountsChanged', async (change) => {
                if (this.props.verbose) {
                    console.log('accountsChanged:', change);
                }
                this.refreshWallet();
            });
            window.ethereum.on('chainChanged', async (change) => {
                if (this.props.verbose) {
                    console.log('chainChanged:', change);
                }
                this.refreshWallet();
            });
        }
        if (connector) {
            connector.on('session_update', async (error, payload) => {
                console.log(`connector.on("session_update")`, payload);
                this.refreshWallet();
            });
            connector.on('connect', async (error, payload) => {
                console.log(`connector.on("connect")`, payload);
                this.setState({ using: 'WalletConnect' });
                await this.refreshWallet();
                ConnectWalletModal.hide();
            });
            connector.on('disconnect', (error, payload) => {
                console.log(`connector.on("disconnect")`, payload);
                this.setState({ wallet: undefined });
            });
            this.refreshWallet();
        }
    }
    async refreshWallet() {
        if (this.state.using === 'WalletConnect') {
            const wallet = await getInfo();
            this.setState({ wallet, loading: false });
        } else {
            const wallet = await getCurrentWalletConnected();
            this.setState({ wallet, loading: false });
        }
    }
    render() {
        return (
            <WalletContext.Provider value={{ ...this.state }}>
                <ToastContainer theme="dark" />
                {this.props.children}
            </WalletContext.Provider>
        );
    }
}
export function useWallet() {
    const context = React.useContext(WalletContext);
    if (context === undefined) {
        throw new Error('useWallet must be used within a Provider');
    }
    return context;
}

class Contract {
    constructor(props) {
        this.context = props.context;
        this.standard = props.standard;
        this.address = props.address;
        this.contract = new props.context.web3.eth.Contract(abis[props.standard], props.address);
        this.call = this.call.bind(this);
        this.send = this.send.bind(this);
    }
    async call(functionName, params) {
        if (this.context.wallet.address) {
            let tx;
            if (params) {
                tx = this.contract.methods[functionName](...params);
            } else {
                tx = this.contract.methods[functionName]();
            }
            return new Promise((resolve, reject) => {
                tx.call({ from: this.context.wallet.address })
                    .then((e) => {
                        resolve(e);
                    })
                    .catch((error) => {
                        toast.error(error.message);
                        reject(error.message);
                    });
            });
        } else {
            toast.error('No wallet connected');
            return 'No wallet connected';
        }
    }
    async send(functionName, params, onReceipt, onTransactionHash, onError) {
        if (this.context.wallet.address) {
            let tx;
            if (params) {
                tx = this.contract.methods[functionName](...params);
            } else {
                tx = this.contract.methods[functionName]();
            }
            const estimation = await tx.estimateGas({ from: this.context.wallet.address }).catch((error) => {
                toast.error(error.message.split('\n')[0]);
                return error.message.split('\n')[0];
            });
            console.log('Estimated gas:', estimation);
            if (estimation) {
                return new Promise((resolve, reject) => {
                    tx.send({ from: this.context.wallet.address })
                        .on('receipt', function (receipt) {
                            if (receipt.status == true) {
                                toast.update(this.toastId, {
                                    render: 'Transaction sent succesfully.',
                                    type: toast.TYPE.SUCCESS,
                                    autoClose: 1000
                                });
                            } else {
                                toast.update(this.toastId, {
                                    render: 'Transaction failed to send.',
                                    type: toast.TYPE.ERROR,
                                    autoClose: 1000
                                });
                            }
                            if (onReceipt) {
                                onReceipt(receipt);
                            }
                            resolve(receipt);
                        })
                        .on('transactionHash', function (transactionHash) {
                            this.toastId = toast('Sending transaction...', {
                                autoClose: false,
                                type: toast.TYPE.INFO
                            });
                            if (onTransactionHash) {
                                onTransactionHash(transactionHash);
                            }
                        })
                        .catch((error) => {
                            if (this.toastId) {
                                toast.update(this.toastId, {
                                    render: error.message,
                                    type: toast.TYPE.ERROR,
                                    autoClose: 1000
                                });
                            } else {
                                toast.error(error.message);
                            }

                            if (onError) {
                                onError(error.message);
                            }
                            reject(error.message);
                        });
                });
            }
        } else {
            toast.error('No wallet connected');
            return 'No wallet connected';
        }
    }
}
export function useContract(address, standard) {
    const context = React.useContext(WalletContext);
    if (abis[standard.toUpperCase()] && context.web3) {
        const sc = new Contract({ context, address, standard: standard.toUpperCase() });
        return sc;
    }
    return null;
}
export function withWallet(WrappedComponent) {
    return class extends React.Component {
        static contextType = WalletContext;
        render() {
            return <WrappedComponent {...this.context} {...this.props} />;
        }
    };
}
