import { fromWei } from './common';
import { toast } from 'react-toastify';
import Web3 from 'web3/dist/web3.min.js';

function parseBalance(balance, decimal) {
    return parseFloat(fromWei(Web3.utils.toBN(balance).toString(), decimal));
}

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_accounts'
            });

            if (addressArray.length > 0) {
                let balance = await window.ethereum.request({
                    method: 'eth_getBalance',
                    params: [addressArray[0], 'latest']
                });
                balance = parseBalance(balance);

                let chainId = await window.ethereum.request({ method: 'eth_chainId' });
                chainId = parseInt(chainId, 16);
                return {
                    balance,
                    address: addressArray[0],
                    chainId
                };
            } else {
                return {
                    status: '🦊 Connect to Metamask using the top right button.'
                };
            }
        } catch (err) {
            return {
                status: '😥 ' + err.message
            };
        }
    } else {
        return {
            status: 'You must install Metamask, a virtual Ethereum wallet, in your browser.'
        };
    }
};
const subscribers = {};
function publish(eventName, data) {
    if (!Array.isArray(subscribers[eventName])) {
        return;
    }
    subscribers[eventName].forEach((callback) => {
        callback(data);
    });
}
export function subscribe(eventName, callback) {
    if (!Array.isArray(subscribers[eventName])) {
        subscribers[eventName] = [];
    }
    subscribers[eventName].push(callback);
}

export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum
                .request({
                    method: 'eth_requestAccounts'
                })
                .catch((e) => {
                    throw e.message;
                });
            if (addressArray.length > 0) {
                publish('connect');
                let balance = await window.ethereum.request({
                    jsonrpc: '2.0',
                    method: 'eth_getBalance',
                    params: [addressArray[0], 'latest']
                });
                balance = parseBalance(balance);

                let chainId = await window.ethereum.request({ method: 'eth_chainId' });
                chainId = parseInt(chainId, 16);

                return {
                    balance,
                    address: addressArray[0],
                    chainId
                };
            } else {
                throw '🦊 Connect to Metamask.';
            }
        } catch (err) {
            if (err.message) {
                throw err.message + ' 😥';
            } else {
                throw err + ' 😥';
            }
        }
    } else {
        throw 'You must install Metamask, a virtual Ethereum wallet, in your browser.';
    }
};
