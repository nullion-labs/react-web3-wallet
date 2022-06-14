import React, { Component } from 'react';

import { ToastContainer, toast } from 'react-toastify';

import Web3 from 'web3/dist/web3.min.js';
import { getCurrentWalletConnected } from './helpers/Web3';

export * from './components';

import 'react-toastify/dist/ReactToastify.css';
import './assets/scss/app.scss';

const WalletContext = React.createContext();

export class Provider extends Component {
    static contextType = WalletContext;
    constructor(props) {
        super(props);
        this.state = {};

        Provider.testFunction = this.testFunction.bind(this);
        this.refreshWallet = this.refreshWallet.bind(this);

        if (window.ethereum) {
            if (!this.state.web3) {
                this.state.web3 = new Web3(window.ethereum);
                if (!this.subscription) {
                    if (this.props.verbose) {
                        console.log('Subscribed to newBlockHeaders');
                    }
                    this.subscription = this.state.web3.eth.subscribe('newBlockHeaders', async (error, event) => {
                        if (this.props.verbose) {
                            console.log('newBlockHeaders[', window.ethereum.chainId, '][', event.number, ']');
                        }
                        this.refreshWallet();
                    });
                }
            }

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
    }
    async refreshWallet() {
        const wallet = await getCurrentWalletConnected();
        this.setState({ wallet });
    }
    async componentDidMount() {
        this.refreshWallet();
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
