import 'dotenv/config';
import { ethers } from 'ethers';
import fs from 'fs';

async function main() {
    // 1. Inisialisasi Provider & Wallet
    const rpc = process.env.RPC_URL;
    const pk = process.env.PRIVATE_KEY;

    if (!rpc || !pk) {
        console.error("❌ Variabel lingkungan RPC_URL atau PRIVATE_KEY tidak ditemukan!");
        process.exit(1);
    }

    const provider = new ethers.JsonRpcProvider(rpc);
    const wallet = new ethers.Wallet(pk, provider);

    console.log(`--- Base Sepolia Activity Log ---`);
    
    try {
        // 2. Cek Saldo & Kirim Transaksi
        const balance = await provider.getBalance(wallet.address);
        const ethBalance = ethers.formatEther(balance);
        
        console.log("Mengirim heartbeat...");
        const tx = await wallet.sendTransaction({ 
            to: wallet.address, 
            value: 0 
        });
        
        console.log(`⏳ Menunggu konfirmasi: ${tx.hash}`);
        await tx.wait();
        console.log("✅ Heartbeat Terkonfirmasi!");

        // 3. Format Tabel Dashboard untuk README
        const timestamp = new Date().toLocaleString('id-ID', { 
            timeZone: 'Asia/Jakarta',
            dateStyle: 'full',
            timeStyle: 'long'
        });

        const dashboardTable = `# Indraseven's Web3 Monitor 🚀

> Automated by GitHub Actions & Termux.

| 📊 Metrik | Keterangan |
| :--- | :--- |
| **Wallet Address** | \`${wallet.address}\` |
| **Network** | \`Base Sepolia Testnet\` |
| **Current Balance** | \`${ethBalance} ETH\` |
| **Last Heartbeat** | \`${timestamp}\` |
| **Transaction Hash** | [\`${tx.hash.substring(0, 20)}...\`](https://sepolia.basescan.org/tx/${tx.hash}) |

---
*Status: Operasional - Diperbarui secara otomatis setiap hari via GitHub Actions.*`;

        // 4. Tulis ke file README.md
        fs.writeFileSync('README.md', dashboardTable);
        console.log("📝 README.md telah diperbarui dengan format tabel.");

    } catch (error) {
        console.error("❌ Terjadi kesalahan:", error.message);
        process.exit(1);
    }
}

main();
