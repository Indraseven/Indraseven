import 'dotenv/config';
import { ethers } from 'ethers';
import fs from 'fs';

async function main() {
    const rpc = process.env.RPC_URL;
    if (!rpc) throw new Error("❌ RPC_URL missing");

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    console.log(`--- Base Sepolia Activity Log ---`);
    const balance = await provider.getBalance(wallet.address);
    const ethBalance = ethers.formatEther(balance);

    // 1. Jalankan Transaksi Heartbeat
    console.log("Sending heartbeat...");
    try {
        const tx = await wallet.sendTransaction({ to: wallet.address, value: 0 });
        const receipt = await tx.wait();
        console.log(`✅ Success: ${tx.hash}`);

        // 2. Update README.md (Dynamic Dashboard)
        const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
        const content = `# Indraseven's Web3 Monitor 🚀

> Ini adalah dashboard otomatis yang dikelola oleh Termux & GitHub Actions.

### 📊 Wallet Status (Base Sepolia)
- **Address:** \`${wallet.address}\`
- **Balance:** \`${ethBalance} ETH\`
- **Last Heartbeat:** \`${timestamp}\`
- **Last Tx Hash:** [\`${tx.hash}\`](https://sepolia.basescan.org/tx/${tx.hash})

---
*Generated automatically by Indraseven's Heartbeat Bot.*`;

        fs.writeFileSync('README.md', content);
        console.log("📝 README.md updated locally.");

    } catch (err) {
        console.error("❌ Failed:", err.message);
    }
}

main();
