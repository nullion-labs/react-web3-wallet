import React from 'react';
import './assets/scss/app.scss';

export const Context = React.createContext({});
export const config = { currencySymbol: 'ETH', blockExplorerURL: 'https://etherscan.io/', RPC: 'http://127.0.0.1:8545' };

export * from './components/WalletProvider';
export * from './components/WalletConnect';
export * from './components/WalletToast';
