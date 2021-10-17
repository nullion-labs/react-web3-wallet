import React, { Component } from 'react';
import Web3 from 'web3';
import { config, Context } from '../NullETH';
export class WalletConnect extends Component {
    render() {
        return (
            <Context.Consumer>
                {(props) => (
                    <div className={`wallet`}>
                        {window.ethereum ? (
                            props.wallet?.address.length > 0 ? (
                                <React.Fragment>
                                    <span>
                                        {props.wallet.balance && parseFloat(Web3.utils.fromWei(props.wallet.balance)).toFixed(3)}{' '}
                                        {config.currencySymbol}
                                    </span>
                                    <a href={`${config.blockExplorerURL}/address/${props.wallet.address}`}>
                                        {`${props.wallet.address.substr(0, 5)}...${props.wallet.address.substr(
                                            props.wallet.address.length - 4
                                        )}`}
                                    </a>
                                </React.Fragment>
                            ) : (
                                /* eslint-disable */
                                <a onClick={props.connect}>Connect to a wallet</a>
                            )
                        ) : (
                            <a href="https://metamask.io/download">Install Metamask</a>
                        )}
                    </div>
                )}
            </Context.Consumer>
        );
    }
}
