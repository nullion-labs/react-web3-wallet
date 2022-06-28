import React, { Component } from 'react';
import { createRoot } from 'react-dom/client';
import { Provider, ConnectWallet, useWallet, useContract, getContract } from './nullius';

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
                    <Test />
                </Provider>
            </div>
        );
    }
}

const Test = () => {
    const w = useWallet();
    const contract = useContract('0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d', 'erc721');
    const test = async () => {
        const name = await contract.call('name');
        console.log(name);
        // const res = await contract.send('toggleWhitelist', [false]);
    };
    return <h1 onClick={test}>hello</h1>;
};

const container = document.getElementById('root');
const root = createRoot(container);
root.render(<Index />);
//0x80ac58cd    erc721
//0xd9b67a26    erc1155
//0x36372b07    erc20
