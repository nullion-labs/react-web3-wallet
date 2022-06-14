import React, { Component, useState } from 'react';
import { createRoot } from 'react-dom/client';

import { ToastContainer, toast } from 'react-toastify';

import Web3 from 'web3/dist/web3.min.js';
import { getCurrentWalletConnected, connectWallet } from './components/Web3';

import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/app.scss';

const WalletContext = React.createContext();
let modalContainer;
if (!document.getElementById('nullius-wallet-modal')) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'nullius-wallet-modal';
    modalContainer.className = 'nullius-wallet-modal';
    document.body.appendChild(modalContainer);
}

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
                console.log(change);
                console.log(wallet);
                this.setState({
                    web3: new Web3(window.ethereum),
                    wallet
                });
            });
        }
    }
    async componentDidMount() {
        const wallet = await getCurrentWalletConnected();
        if (wallet.address) {
            this.setState({
                web3: new Web3(window.ethereum),
                wallet
            });
        }
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
export function withWallet(WrappedComponent) {
    return class extends React.Component {
        static contextType = Context;
        render() {
            return <WrappedComponent {...this.context} {...this.props} />;
        }
    };
}
class WalletConnectModal extends Component {
    constructor(props) {
        super(props);
        this.state = { shown: false };
        WalletConnectModal.show = this.show.bind(this);
        WalletConnectModal.hide = this.hide.bind(this);
    }
    show(content) {
        this.setState({ shown: true, content });
    }
    hide() {
        this.setState({ shown: false, content: undefined });
    }

    render() {
        return this.state.shown ? (
            <div className="nullius-wallet-modal-wrapper">
                <div className="nullius-wallet-modal-container">
                    {this.state.content}
                    <div onClick={WalletConnectModal.hide} className="nullius-wallet-modal-close">
                        X
                    </div>
                </div>
            </div>
        ) : (
            <React.Fragment />
        );
    }
}
const root = createRoot(modalContainer);
root.render(<WalletConnectModal />);
function WalletConnectModalComponent() {
    const [loading, setLoading] = useState(false);
    return (
        <div className="nullius-wallet-modal-content" style={{ pointerEvents: loading === true ? 'none' : 'all' }}>
            <h1>Connect your wallet.</h1>
            <p>Connect with one of our available wallet providers.</p>
            <button
                disabled={loading}
                onClick={async (e) => {
                    setLoading(true);
                    const wallet = await connectWallet();
                    if (wallet.address) {
                        WalletConnectModal.hide();
                    } else {
                        setLoading(false);
                        s;
                    }
                }}>
                <img src="https://opensea.io/static/images/logos/metamask-fox.svg" alt="Metamask" />
                MetaMask
            </button>
            <button
                disabled={loading}
                onClick={(e) => {
                    connectWallet();
                }}>
                <img src="https://static.opensea.io/logos/walletconnect-alternative.png" alt="WalletConnect" />
                WalletConnect
            </button>
        </div>
    );
}
export function WalletConnect() {
    const { wallet } = useWallet();
    return (
        <div className="nullius-wallet-connect">
            {wallet?.address ? (
                <div className="nullius-wallet-connect-address">
                    {typeof wallet.balance !== 'undefined' && <span>{wallet.balance.toFixed(2)} ETH</span>}
                    <span>
                        {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                    </span>
                </div>
            ) : (
                <div className="nullius-wallet-connect-content">
                    <button
                        className="nullius-wallet-connect-button"
                        onClick={(e) => {
                            WalletConnectModal.show(<WalletConnectModalComponent />);
                        }}>
                        Connect Wallet
                    </button>
                </div>
            )}
        </div>
    );
}
