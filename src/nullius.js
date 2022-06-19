import React, { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';
import WalletConnect from '@walletconnect/client';

import Web3 from 'web3/dist/web3.min.js';
import { getCurrentWalletConnected, subscribe } from './helpers/Web3';
import { getInfo } from './helpers/WalletConnect';

export * from './components';

import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/app.scss';

const WalletContext = React.createContext();
export const connector = new WalletConnect({ bridge: 'https://bridge.walletconnect.org' });

export class Provider extends Component {
    static contextType = WalletContext;
    constructor(props) {
        super(props);
        this.state = { using: 'WalletConnect', connector, loading: true };
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
            <WalletContext.Provider value={this.state}>
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
export function withWallet(WrappedComponent) {
    return class extends React.Component {
        static contextType = Context;
        render() {
            return <WrappedComponent {...this.context} {...this.props} />;
        }
    };
}
