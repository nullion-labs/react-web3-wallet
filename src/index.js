import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { WalletConnect, WalletProvider, WalletToast } from './NullETH';

export default class Index extends Component {
    componentDidMount() {
        WalletToast.process('hello');
    }
    render() {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '100%', height: '100vh' }}>
                <WalletProvider>
                    <WalletConnect />
                </WalletProvider>
            </div>
        );
    }
}

ReactDOM.render(<Index />, document.getElementById('root'));
