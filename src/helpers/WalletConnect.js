import { connector } from '../nullius';
import axios from 'axios';
import { fromWei } from './common';
export async function getURI(_connector) {
    if (!connector.connected) {
        await connector.createSession();
    }
    const protocol = _connector.protocol;
    const handshakeTopic = _connector.handshakeTopic;
    const version = _connector.version;
    const bridge = encodeURIComponent(_connector.bridge);
    const key = _connector.key;
    const uri = `${protocol}:${handshakeTopic}@${version}?bridge=${bridge}&key=${key}`;
    return uri;
}
function parseBalance(balance, decimal) {
    return parseFloat(fromWei(balance, decimal));
}
const api = axios.create({
    baseURL: 'https://ethereum-api.xyz',
    timeout: 30000,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json'
    }
});
export async function apiGetAccountAssets(address, chainId) {
    const response = await api.get(`/account-assets?address=${address}&chainId=${chainId}`);
    const { result } = response.data;
    return result;
}
export async function apiGetBalance(address, chainId) {
    const response = await api.get(`/account-balance?address=${address}&chainId=${chainId}`);
    const { result } = response.data;
    return result;
}
export const getInfo = async () => {
    if (connector.connected) {
        try {
            const account = connector.accounts[0];
            let balance = await apiGetBalance(account, connector.chainId);
            balance = balance.balance;
            balance = parseBalance(balance);
            return {
                balance,
                address: account,
                chainId: connector.chainId
            };
        } catch (err) {
            return {
                status: '😥 ' + err.message
            };
        }
    } else {
        return {
            status: '😥 Not connected'
        };
    }
};
