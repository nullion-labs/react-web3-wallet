export const getCurrentWalletConnected = async () => {
    if (window.ethereum) {
        try {
            const addressArray = await window.ethereum.request({
                method: 'eth_accounts'
            });
            const balance = await window.ethereum.request({
                method: 'eth_getBalance',
                params: [addressArray[0]]
            });
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
                    address: '',
                    status: '🦊 Connect to Metamask using the top right button.'
                };
            }
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
export const connectWallet = async () => {
    if (window.ethereum) {
        try {
            const block = await window.ethereum.request({
                jsonrpc: '2.0',
                method: 'eth_getBlockByNumber',
                params: ['latest', false]
            });
            const addressArray = await window.ethereum.request({
                method: 'eth_requestAccounts'
            });

            const balance = await window.ethereum.request({
                jsonrpc: '2.0',
                method: 'eth_getBalance',
                params: [addressArray[0], block.number]
            });
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
