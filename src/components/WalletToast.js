import { Component } from 'react';
import Web3 from 'web3';
import { toast } from 'react-toastify';
import { config } from '../NullETH';

export class WalletToast extends Component {
    async process(tx) {
        const web3 = new Web3(config.RPC);
        const res = await web3.eth.getBlockNumber();
        console.log(res);
        const t = toast.info(tx, { autoClose: false });
        setTimeout(() => {
            toast.dismiss(t);
        }, 3000);
    }
}
WalletToast.process = WalletToast.prototype.process;
