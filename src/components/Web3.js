import Web3 from 'web3/dist/web3.min.js';

function parseBalance(balance, decimal) {
    return parseFloat(Web3.utils.fromWei(Web3.utils.toBN(balance).toString()));
}

export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_accounts'
            });

            let balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [addressArray[0], 'latest']
            });
            balance = parseBalance(balance);

            let chainId = await window.ethereum.request({ method: 'eth_chainId' });
            chainId = parseInt(chainId, 16);

            if (addressArray.length > 0) {
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
            console.log(err);
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
export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

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
        } catch (err) {
            return {
                address: '',
                status: '😥 ' + err.message
            };
        }
    } else {
        return {
            address: '',
            status: 'You must install Metamask, a virtual Ethereum wallet, in your browser.'
        };
    }
};
