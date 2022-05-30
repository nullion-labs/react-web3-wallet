import React from 'react';
import './assets/scss/app.scss';

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import Web3 from 'web3';
import { getCurrentWalletConnected, connectWallet } from './Web3';

const Context = React.createContext({});
const config = { currencySymbol: 'ETH', blockExplorerURL: 'https://etherscan.io/', RPC: 'http://127.0.0.1:8545' };

class Provider extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.connect = this.connect.bind(this);

        if (window.ethereum) {
            window.ethereum.on('accountsChanged', async (change) => {
                this.state.web3 = new Web3(window.ethereum);
                this.state.wallet = await getCurrentWalletConnected();
            });
            window.ethereum.on('chainChanged', async (change) => {
                this.state.web3 = new Web3(window.ethereum);
                this.state.wallet = await getCurrentWalletConnected();
            });
            this.state.web3 = new Web3(window.ethereum);
        }
    }
    async connect() {
        const wallet = await connectWallet();
        this.setState({ wallet });
    }
    render() {
        return (
            <Context.Provider value={{ web3: this.state.web3, wallet: this.state.wallet, connect: this.connect }}>
                {this.props.children}
                <ToastContainer theme="dark" />
            </Context.Provider>
        );
    }
}
class Connect extends Component {
    render() {
        return (
            <Context.Consumer>
                {(props) => (
                    <div className={`wallet`}>
                        {window.ethereum ? (
                            props.wallet?.address.length > 0 ? (
                                <React.Fragment>
                                    <span>
                                        {props.wallet.balance && parseFloat(Web3.utils.fromWei(props.wallet.balance)).toFixed(3)}{' '}
                                        {config.currencySymbol}
                                    </span>
                                    <a href={`${config.blockExplorerURL}/address/${props.wallet.address}`}>
                                        {`${props.wallet.address.substr(0, 5)}...${props.wallet.address.substr(
                                            props.wallet.address.length - 4
                                        )}`}
                                    </a>
                                </React.Fragment>
                            ) : (
                                /* eslint-disable */
                                <a onClick={props.connect}>Connect to a wallet</a>
                            )
                        ) : (
                            <a href="https://metamask.io/download">Install Metamask</a>
                        )}
                    </div>
                )}
            </Context.Consumer>
        );
    }
}

export default class Wallet {

}
