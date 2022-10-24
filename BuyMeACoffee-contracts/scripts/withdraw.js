const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {

    const contractAddress = "0x755172Ef01936279fD12006278718073Ee326a50";
    const contractABI = abi.abi;

    const provider = new hre.ethers.providers.AlchemyProvider("polygon", process.env.POLYGON_API_KEY);

    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    console.log("Current balance of owner: ", await getBalance(provider, signer.address), "ETH");

    const contractBalance = await getBalance(provider, buyMeACoffee.address);
    console.log("Current balance of Contract: ", contractBalance, "ETH");

    if (contractBalance !== "0.0") {
        console.log("Withdrawing Funds...");
        const withdrawTxn = await buyMeACoffee.withdrawTips();
        await withdrawTxn.wait();
    } else {
        console.log("No funds to withdraw");
    }

    console.log("Current Balance of Owner: ", await getBalance(provider, signer.address));
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });