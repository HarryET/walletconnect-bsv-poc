# Bitcoin SV <> WalletConnect Proof-of-Concept
This repo has a proof-of-concept for connecting a BitcoinSV dApp to a wallet using WalletConnect v2.

> **Note**
> This is not an official WalletConnect example and only a proof of concept. No support is available from WalletConnect at this time, if you wish to implement for your project/product this please reach out to me <harry@walletconnect.com>. This notice will be removed once there is adequate documentation in place and replaced with a link to that.

## Wallet
This is a CLI app and can be found in `/wallet`

To run the example install the dependencies with `yarn` and then start the wallet with `yarn dev`. This will create a new public/private keypair and ask for a connection URI. You can get this from the dApp.

## dApp
This is a Next.js App and available at `bsv-poc.vercel.app`, you can click connect and then there is a copy button in the top right corner. Paste that URI into the example wallet and then they will be connected.

# License
This project is under the GNU LGPLv3 license and is created by [Harry Bairstow](https://harryet.xyz).
