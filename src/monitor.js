import 'dotenv/config';
import { ethers } from 'ethers';
import fs from 'fs';

async function main() {
    const rpc = process.env.RPC_URL;
    const pk = process.env.PRIVATE_KEY;

    if (!rpc || !pk) {
        console.error("❌ Environment variables missing!");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(pk, provider);

    try {
        console.log(`--- Base Sepolia Activity Log ---`);
        const balance = await provider.getBalance(wallet.address);
        const ethBalance = ethers.formatEther(balance);
        
        console.log("Sending heartbeat...");
        const tx = await wallet.sendTransaction({ to: wallet.address, value: 0 });
        await tx.wait();
        console.log(`✅ Success: ${tx.hash}`);

        const timestamp = new Date().toLocaleString('id-ID', { 
            timeZone: 'Asia/Jakarta',
            dateStyle: 'full',
            timeStyle: 'long'
        });

        // Dashboard dengan Status Badge (Opsi 1 - Professional Table)
        const tableDashboard = `# Indraseven's Web3 Monitor 🚀

![Base Sepolia Status](https://img.shields.io/badge/Base_Sepolia-Active-brightgreen?style=for-the-badge&logo=base&logoColor=white)
![Heartbeat](https://img.shields.io/badge/Heartbeat-Passing-success?style=for-the-badge&logo=github-actions&logoColor=white)

> Automated by GitHub Actions & Termux.

| 📊 Metrik | Keterangan |
| :--- | :--- |
| **Wallet Address** | \`${wallet.address}\` |
| **Network** | \`Base Sepolia Testnet\` |
| **Current Balance** | \`${ethBalance} ETH\` |
| **Last Heartbeat** | \`${timestamp}\` |
| **Transaction Hash** | [\`${tx.hash.substring(0, 24)}...\`](https://sepolia.basescan.org/tx/${tx.hash}) |

---
*Status: Operasional - Diperbarui secara otomatis setiap hari via GitHub Actions.*`;

        fs.writeFileSync('README.md', tableDashboard);
        console.log("📝 README.md updated with Status Badges.");

    } catch (error) {
        console.error("❌ Error:", error.message);
        process.exit(1);
    }
}

main();
