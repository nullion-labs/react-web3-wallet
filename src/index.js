import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, WalletConnect } from './nullius';

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
                <Provider>
                    <WalletConnect />
                </Provider>
            </div>
        );
    }
}

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Index />);
