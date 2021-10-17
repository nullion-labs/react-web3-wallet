import React, { Component } from 'react';
import Web3 from 'web3';
import { getCurrentWalletConnected, connectWallet } from './Web3';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { Context } from '../NullETH';

export class WalletProvider extends Component {
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
