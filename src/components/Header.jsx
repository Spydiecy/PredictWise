import React from 'react';
import { ConnectButton } from 'thirdweb/react';
import { createWallet } from 'thirdweb/wallets';
import { client } from '../client';
import { etherlink_testnet } from '../native-chains/etherlink';

const Header = () => {
    return (
        <header className="relative bg-gradient-to-r from-violet-950/90 to-indigo-950/90 backdrop-blur-sm border-b border-violet-500/10">
            <div className="max-w-7xl mx-auto">
                <div className="flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center space-x-2">
                        {/* Logo/Name with glow effect */}
                        <h1 className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-indigo-300 text-2xl font-bold tracking-tight hover:from-violet-300 hover:to-indigo-200 transition-all duration-300">
                            PredictWise
                        </h1>
                        {/* Optional: Add a small badge/tag */}
                        <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-violet-500/10 text-violet-200 border border-violet-500/20">
                            Beta
                        </span>
                    </div>

                    <div className="relative">
                        {/* Glowing background effect for the connect button */}
                        <div className="absolute -inset-1 bg-gradient-to-r from-violet-500 to-indigo-500 rounded-lg blur opacity-20 group-hover:opacity-30 transition duration-1000"></div>
                        
                        {/* Wrap the ConnectButton in a styled div */}
                        <div className="relative">
                            <ConnectButton
                                client={client}
                                chain={etherlink_testnet}
                                wallets={[createWallet("io.metamask")]}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;