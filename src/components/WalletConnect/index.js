import React from 'react';
import { WalletConnectModal } from './WalletConnectModal';
import { useWallet } from '../../nullius';

export default function WalletConnect() {
    const { wallet } = useWallet();
    return (
        <div className="nullius-wallet-connect">
            {wallet?.address ? (
                <div className="nullius-wallet-connect-address">
                    {typeof wallet.balance !== 'undefined' && <span>{wallet.balance.toFixed(2)} ETH</span>}
                    <span>
                        {wallet.address.substring(0, 6)}...{wallet.address.substring(wallet.address.length - 4)}
                    </span>
                </div>
            ) : (
                <div className="nullius-wallet-connect-content">
                    <button
                        className="nullius-wallet-connect-button"
                        onClick={(e) => {
                            WalletConnectModal.show();
                        }}>
                        Connect Wallet
                    </button>
                </div>
            )}
        </div>
    );
}
