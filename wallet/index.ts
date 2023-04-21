import { SignClient } from "@walletconnect/sign-client";
import { buildApprovedNamespaces } from "@walletconnect/utils";
// @ts-ignore
import bsv from "bsv"
// @ts-ignore
import inquirer from "inquirer";

function key() {
    var privK = bsv.PrivKey.fromRandom();
    return privK.toWif();
}

const PROJECT_ID = "33144d3855ac57c2784d4d7b17b8b9f1";
const CHAIN = "bip122:000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f";

(async () => {
    const k = key();

    console.log("Public Key: " + k);

    const signClient = await SignClient.init({
        projectId: PROJECT_ID,
        metadata: {
            name: "Bitcoin SV Wallet",
            description: "Demo Bitcoin SV Wallet",
            url: "#",
            icons: ["https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Gradient/Icon.png"],
        },
    });

    signClient.on("session_proposal", async (e) => {
        const approvedNamespaces = buildApprovedNamespaces({
            proposal: e.params,
            supportedNamespaces: {
                bip122: {
                    chains: [CHAIN],
                    methods: [],
                    events: ["accountsChanged", "chainChanged"],
                    accounts: [`${CHAIN}:${k}`]
                },
            },
        });

        const { topic, acknowledged } = await signClient.approve({
            id: e.id,
            namespaces: approvedNamespaces,
        });

        const ack = await acknowledged();

        console.debug(ack);
    })

    const answers = await inquirer.prompt([
        {
            type: "input",
            name: "uri",
            message: "Enter the URI",
        }
    ])

    await signClient.pair({ uri: answers.uri });
})()
