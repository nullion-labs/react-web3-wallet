import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, ConnectWallet } from './nullius';

export default class Index extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <div
                style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    width: '100%',
                    height: '100vh'
                }}>
                <Provider verbose>
                    <ConnectWallet />
                </Provider>
            </div>
        );
    }
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Index />);
//0x80ac58cd    erc721
//0xd9b67a26    erc1155
//0x36372b07    erc20
