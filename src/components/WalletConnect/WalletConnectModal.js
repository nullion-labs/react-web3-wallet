import React, { Component, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { connectWallet } from '../../helpers/Web3';
import { toast } from 'react-toastify';

import metamaskIcon from '../../assets/images/metamask.png';
import walletconnectIcon from '../../assets/images/walletconnect.png';

export class WalletConnectModal extends Component {
    constructor(props) {
        super(props);
        this.state = { shown: false };
        WalletConnectModal.show = this.show.bind(this);
        WalletConnectModal.hide = this.hide.bind(this);
    }
    show() {
        this.setState({ shown: true });
    }
    hide() {
        this.setState({ shown: false });
    }

    render() {
        return this.state.shown ? (
            <div className="nullius-wallet-modal-wrapper" onClick={WalletConnectModal.hide}>
                <div className="nullius-wallet-modal-container">
                    <WalletConnectModalComponent />
                    <div onClick={WalletConnectModal.hide} className="nullius-wallet-modal-close">
                        X
                    </div>
                </div>
            </div>
        ) : (
            <React.Fragment />
        );
    }
}
function WalletConnectModalComponent() {
    const [loading, setLoading] = useState(false);
    return (
        <div className="nullius-wallet-modal-content" style={{ pointerEvents: loading === true ? 'none' : 'all' }}>
            <h1>Connect your wallet.</h1>
            <p>Connect with one of our available wallet providers.</p>
            <button
                disabled={loading}
                onClick={async (e) => {
                    setLoading(true);
                    const wallet = await toast
                        .promise(connectWallet, {
                            pending: 'Connecting wallet',
                            success: 'Wallet Connected 👌',
                            error: {
                                render(error) {
                                    return error.data;
                                }
                            }
                        })
                        .catch(() => {});
                    if (wallet?.address) {
                        WalletConnectModal.hide();
                    }
                    setLoading(false);
                }}>
                <img src={metamaskIcon} alt="Metamask" />
                MetaMask
            </button>
            <button
                disabled={loading}
                onClick={(e) => {
                    connectWallet();
                }}>
                <img src={walletconnectIcon} alt="WalletConnect" />
                WalletConnect
            </button>
        </div>
    );
}

let modalContainer;
if (!document.getElementById('nullius-wallet-modal')) {
    modalContainer = document.createElement('div');
    modalContainer.id = 'nullius-wallet-modal';
    modalContainer.className = 'nullius-wallet-modal';
    document.body.appendChild(modalContainer);
}
const root = createRoot(modalContainer);
root.render(<WalletConnectModal />);
