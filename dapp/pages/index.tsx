import SignClient from "@walletconnect/sign-client";
import { useEffect, useState } from "react";
import { Web3Modal } from "@web3modal/standalone";
import type { SessionTypes } from "@walletconnect/types";

const PROJECT_ID = "bce510d10d419eec0ecca89c20532580";
const CHAIN = "bip122:000000000019d6689c085ae165831e934ff763ae46a2a6c172b3f1b60a8ce26f";

const web3Modal = new Web3Modal({
  projectId: PROJECT_ID,
  // `standaloneChains` can also be specified when calling `web3Modal.openModal(...)` later on.
  standaloneChains: [CHAIN],
  walletConnectVersion: 2
});

export default function Home() {
  const [signClient, setSignClient] = useState<SignClient | null>(null);
  const [session, setSession] = useState<SessionTypes.Struct | null>(null);
  //const [topic, setTopic] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      const internalClient = await SignClient.init({
        projectId: PROJECT_ID,
        metadata: {
          name: "Bitcoin SV dApp",
          description: "Demo Bitcoin SV dApp",
          url: "#",
          icons: ["https://raw.githubusercontent.com/WalletConnect/walletconnect-assets/master/Icon/Black/Icon.png"],
        },
      });

      setSignClient(internalClient);
    })()
  }, [])

  useEffect(() => {
    if (signClient) {
      // signClient.on("session_update", ({ topic }) => {
      //   setTopic(topic);
      // });
    }
  }, [signClient])

  const connect = async () => {
    if (!signClient) return;

    try {
      const { uri, approval } = await signClient.connect({
        requiredNamespaces: {
          bip122: {
            methods: [],
            chains: [CHAIN],
            events: ["chainChanged", "accountsChanged"],
          },
        },
      });

      // Open QRCode modal if a URI was returned (i.e. we're not connecting an existing pairing).
      if (uri) {
        web3Modal.openModal({ uri });
        // Await session approval from the wallet.
        const session = await approval();
        // Handle the returned session (e.g. update UI to "connected" state).
        setSession(session);
        // Close the QRCode modal in case it was open.
        web3Modal.closeModal();
      }
    } catch (e) {
      console.error(e);
    }
  }

  const disconnect = async () => {
    if (!session || !signClient) return;

    signClient.disconnect({ topic: session.topic, reason: { code: 69420, message: "Bye Bye" } });
    setSession(null)
  }

  return (
    <div className="flex flex-col space-y-6 mx-12 my-12">
      <h1 className="text-2xl font-bold">WalletConnect {"<>"} BitcoinSV Proof-Of-Concept</h1>
      { !session && <button onClick={connect} className="px-4 py-2 rounded bg-blue-500 shadow">Connect</button>}
      { session && (<div className="flex flex-row items-center gap-4">
        <img className={"w-20 h-20 rounded"} src={session.peer.metadata.icons[0] ?? ""} />
        <div>
          <h2 className="text-gray-200 text-lg">{session.peer.metadata.name}</h2>
          <p className="text-gray-400 text-md">{session.peer.metadata.description}</p>
        </div>
      </div>)}
      { session && session.namespaces["bip122"] && (<div className="flex flex-col">
          <h1 className="text-gray-200 text-xl">Addresses</h1>
          <div className="flex flex-col gap-2">
          { session.namespaces["bip122"].accounts.map((a) => a.replace(`${CHAIN}:`, "")).map(a => (
            <a href={`https://whatsonchain.com/address/${a}`} className="text-blue-500 hover:underline text-md">{a}</a>
          )) }
          </div>
      </div>) }
      { session && <button onClick={disconnect} className="px-4 py-2 rounded bg-red-500 shadow">Disconnect</button>}
    </div>
  )
}
