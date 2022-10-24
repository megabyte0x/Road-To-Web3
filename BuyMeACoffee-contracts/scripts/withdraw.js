const { ethers } = require("hardhat");
const hre = require("hardhat");
const abi = require("../artifacts/contracts/BuyMeACoffee.sol/BuyMeACoffee.json");

async function getBalance(provider, address) {
    const balanceBigInt = await provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function main() {

    const contractAddress = "0x755172Ef01936279fD12006278718073Ee326a50";
    const contractABI = abi.abi;

    const provider = new hre.ethers.providers.AlchemyProvider("maticmum", process.env.POLYGON_API_KEY);

    const signer = new hre.ethers.Wallet(process.env.PRIVATE_KEY, provider);
    const tipper1 = new hre.ethers.Wallet(process.env.TIPPER_PRIVATE_KEY, provider);

    const buyMeACoffee = new hre.ethers.Contract(contractAddress, contractABI, signer);

    console.log("Current balance of owner: ", await getBalance(provider, signer.address), "MATIC");

    console.log("Current balance of tipper: ", await getBalance(provider, tipper1.address), "MATIC");

    console.log("Current balance of Contract: ", await getBalance(provider, buyMeACoffee.address), "MATIC");

    const buyCofeeTx = await buyMeACoffee.connect(tipper1).buyCoffee("Patrick", "You are awesome", { value: ethers.utils.parseEther("0.1") });
    await buyCofeeTx.wait();

    const contractBalance = await getBalance(provider, buyMeACoffee.address);

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