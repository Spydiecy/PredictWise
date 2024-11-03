import React, { useState, useEffect } from 'react';
import './Header.css';
import { ConnectButton } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { client } from '../client'
import { etherlink_testnet } from '../native-chains/etherlink'

const Header = () => {
    return (
        <header className="header">
            <div className="header-left">
                <h1>Omega Protocol</h1>
            </div>
            <div className="header-right">
                <ConnectButton
                client={client}
                chain={etherlink_testnet}
                wallets={[
                    createWallet("io.metamask")
                ]}
                ></ConnectButton>
            </div>
        </header>
    );
};

export default Header;