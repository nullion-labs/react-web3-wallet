import React from 'react';
import { ConnectWalletModal } from './ConnectWalletModal';
import { useWallet } from '../../nullius';

export default function ConnectWallet() {
    const { wallet, loading, chainId } = useWallet();
    const changeNetwork = () => {
        window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [
                {
                    chainId: `0x${chainId}`
                }
            ]
        });
    };
    return (
        <div className="nullius-wallet-connect">
            {loading ? (
                <div className="nullius-wallet-connect-content">
                    <div className="nullius-wallet-connect-loading" />
                </div>
            ) : wallet?.address ? (
                <React.Fragment>
                    <div className="nullius-wallet-connect-address">
                        {typeof wallet.balance !== 'undefined' && <span>{wallet.balance.toFixed(2)} ETH</span>}
                        <span>
                            {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                        </span>
                    </div>
                    {wallet.chainId != chainId && (
                        <div className="nullius-wallet-connect-address" style={{ marginTop: 12, fontSize: 10, flexDirection: 'column' }}>
                            <span>Your wallet is on wrong network.</span>
                            <span>
                                Please connect to the
                                <a href="#" onClick={changeNetwork}>
                                    {' '}
                                    network #{chainId}
                                </a>
                            </span>
                        </div>
                    )}
                </React.Fragment>
            ) : (
                <div className="nullius-wallet-connect-content">
                    <button
                        className="nullius-wallet-connect-button"
                        onClick={(e) => {
                            ConnectWalletModal.show();
                        }}>
                        Connect Wallet
                    </button>
                </div>
            )}
        </div>
    );
}
