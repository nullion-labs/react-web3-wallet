import React, { Component } from 'react';
import Web3 from 'web3';
import { config, Context } from '../NullETH';
export class WalletConnect extends Component {
    render() {
        return <Context.Consumer>{(props) => <h1>hello</h1>}</Context.Consumer>;
    }
}
