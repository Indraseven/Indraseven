import 'dotenv/config';
import { ethers } from 'ethers';

async function main() {
    const rpc = process.env.RPC_URL;
    if (!rpc) throw new Error("❌ RPC_URL missing in .env");

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`--- Base Sepolia Activity Log ---`);
    console.log(`Wallet: ${wallet.address}`);

    const balance = await provider.getBalance(wallet.address);
    console.log(`Balance: ${ethers.formatEther(balance)} ETH`);

    // Heartbeat Transaction (0 ETH)
    console.log("Sending heartbeat...");
    try {
        const tx = await wallet.sendTransaction({
            to: wallet.address,
            value: 0
        });
        console.log(`🚀 Tx Sent: ${tx.hash}`);
        await tx.wait();
        console.log("✅ Heartbeat Confirmed!");
    } catch (err) {
        console.error("❌ Failed:", err.message);
    }
}

main();

