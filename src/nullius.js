import React, { Component } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Web3 from 'web3/dist/web3.min.js';
import { getCurrentWalletConnected, connectWallet } from './components/Web3';
const WalletContext = React.createContext();

export class Provider extends Component {
    static contextType = WalletContext;
    constructor(props) {
        super(props);
        this.state = {};
        Provider.testFunction = this.testFunction.bind(this);

        if (window.ethereum) {
            if (window.ethereum.selectedAddress) {
                this.state.web3 = new Web3(window.ethereum);
                this.state.wallet = {
                    address: window.ethereum.selectedAddress,
                    chainId: Web3.utils.hexToNumber(window.ethereum.chainId)
                };
            }
            window.ethereum.on('connect', (connectInfo) => {
                console.log('connect', connectInfo);
            });
            window.ethereum.on('disconnect', (connectInfo) => {
                console.log('disconnect', connectInfo);
            });
            window.ethereum.on('accountsChanged', async (change) => {
                const wallet = await getCurrentWalletConnected();
                this.setState({
                    web3: new Web3(window.ethereum),
                    wallet
                });
            });
            window.ethereum.on('chainChanged', async (change) => {
                const wallet = await getCurrentWalletConnected();
                this.setState({
                    web3: new Web3(window.ethereum),
                    wallet
                });
            });
        }
    }
    async componentDidMount() {
        const wallet = await connectWallet();
        this.setState({
            web3: new Web3(window.ethereum),
            wallet
        });
    }
    testFunction(e) {
        toast.success(e);
    }
    render() {
        return (
            <WalletContext.Provider value={this.state}>
                <ToastContainer />
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
export function WalletInfo() {
    const { wallet } = useWallet();
    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 5, margin: 20, fontSize: 24 }}>
            <span>
                <strong>address:</strong>
                {wallet?.address}
            </span>
            <span>
                <strong>balance:</strong>
                {wallet?.balance}
            </span>
            <span>
                <strong>chainId:</strong>
                {wallet?.chainId}
            </span>
        </div>
    );
}
export function WalletConnect() {
    const { wallet } = useWallet();
    return (
        <div className="wallet-connect" style={{ border: '1px solid blue', padding: 20, fontSize: 24 }}>
            {wallet?.address ? (
                <div>{wallet.address}</div>
            ) : (
                <button
                    onClick={(e) => {
                        connectWallet();
                    }}>
                    Connect Wallet
                </button>
            )}
        </div>
    );
}
export function withWallet(WrappedComponent) {
    return class extends React.Component {
        static contextType = Context;
        render() {
            return <WrappedComponent {...this.context} {...this.props} />;
        }
    };
}
