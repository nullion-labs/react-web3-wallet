import React, { Component, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { connectWallet } from '../../helpers/Web3';
import { getURI } from '../../helpers/WalletConnect';
import { toast } from 'react-toastify';

import metamaskIcon from '../../assets/images/metamask.png';
import walletconnectIcon from '../../assets/images/walletconnect.png';

import QRCode from 'react-qr-code';
import { connector } from '../../nullius';

export class ConnectWalletModal extends Component {
    constructor(props) {
        super(props);
        this.state = { shown: false };
        ConnectWalletModal.show = this.show.bind(this);
        ConnectWalletModal.hide = this.hide.bind(this);
    }
    show() {
        this.setState({ shown: true });
    }
    hide() {
        this.setState({ shown: false });
    }

    render() {
        return this.state.shown ? (
            <div
                className="nullius-wallet-modal-wrapper"
                // onClick={WalletConnectModal.hide}
            >
                <div className="nullius-wallet-modal-container">
                    <ConnectWalletModalComponent />
                    <div onClick={ConnectWalletModal.hide} className="nullius-wallet-modal-close">
                        X
                    </div>
                </div>
            </div>
        ) : (
            <React.Fragment />
        );
    }
}
function ConnectWalletModalComponent() {
    const [loading, setLoading] = useState(false);
    const [WCQRCode, setWCQRCode] = useState();
    const [noMetamask, setNoMetamask] = useState();
    const walletConnect = async () => {
        setLoading(true);
        const _uri = await getURI(connector);
        setWCQRCode(_uri);
        setLoading(false);
    };
    const metamaskConnect = async (e) => {
        setLoading(true);
        if (window.ethereum) {
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
                ConnectWalletModal.hide();
            }
        } else {
            setNoMetamask(true);
        }
        setLoading(false);
    };
    return (
        <div className="nullius-wallet-modal-content" style={{ pointerEvents: loading === true ? 'none' : 'all' }}>
            <h1>Connect your wallet.</h1>
            {noMetamask ? (
                <div style={{ display: 'flex', marginTop: 30, justifyContent: 'center', flexDirection: 'column' }}>
                    <h3 style={{ marginTop: 0 }}>No MetaMask found in your browser.</h3>
                    <span>
                        Please{' '}
                        <a href="https://metamask.io/download/" target="_blank">
                            Download MetaMask.
                        </a>
                    </span>
                </div>
            ) : WCQRCode ? (
                <div style={{ display: 'flex', marginTop: 30, marginBottom: 30, justifyContent: 'center' }}>
                    <QRCode value={WCQRCode} bgColor="transparent" fgColor="#fff" renderAs="svg" level="H" />
                </div>
            ) : (
                <React.Fragment>
                    <p>Connect with one of our available wallet providers.</p>
                    <button disabled={loading} onClick={metamaskConnect}>
                        <img src={metamaskIcon} alt="Metamask" />
                        MetaMask
                    </button>
                    <button disabled={true} onClick={walletConnect} style={{ position: 'relative' }}>
                        <img src={walletconnectIcon} alt="WalletConnect" />
                        WalletConnect
                        <div style={{ position: 'absolute', right: 16, fontSize: 10 }}>Not Supported Yet.</div>
                    </button>
                </React.Fragment>
            )}
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
root.render(<ConnectWalletModal />);
