import 'dotenv/config'; // Cara paling aman untuk ESM
import { ethers } from 'ethers';
import fs from 'fs';

async function main() {
    const rpc = process.env.RPC_URL;
    const pk = process.env.PRIVATE_KEY;

    if (!rpc || !pk) throw new Error("❌ Missing Environment Variables");

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(pk, provider);

    console.log(`--- Base Sepolia Activity Log ---`);
    const balance = await provider.getBalance(wallet.address);
    const ethBalance = ethers.formatEther(balance);

    // Kirim Heartbeat
    console.log("Sending heartbeat...");
    const tx = await wallet.sendTransaction({ to: wallet.address, value: 0 });
    await tx.wait();
    console.log(`✅ Success: ${tx.hash}`);

    // Update README.md secara Dinamis
    const timestamp = new Date().toLocaleString('id-ID', { timeZone: 'Asia/Jakarta' });
    const dashboard = `# Indraseven's Web3 Monitor 🚀

> Automated by GitHub Actions & Termux.

### 📊 Wallet Status (Base Sepolia)
- **Address:** \`${wallet.address}\`
- **Balance:** \`${ethBalance} ETH\`
- **Last Heartbeat:** \`${timestamp}\`
- **Last Tx:** [\`${tx.hash}\`](https://sepolia.basescan.org/tx/${tx.hash})

---
*Last updated: ${timestamp}*`;

    fs.writeFileSync('README.md', dashboard);
    console.log("📝 README.md updated.");
}

main().catch(console.error);
