const hre = require("hardhat");

async function getBalance(address) {
    const balanceBigInt = await hre.ethers.provider.getBalance(address);
    return hre.ethers.utils.formatEther(balanceBigInt);
}

async function printBalances(addresses) {
    let idx = 0;
    for (const address of addresses) {
        console.log(`Address ${idx} balance:`, await getBalance(address));
        idx++;
    }
}

async function printMemos(memos) {
    for (const memo of memos) {
        const timestamp = memo.timestamp;
        const tipper = memo.name;
        const message = memo.message;
        const tipperAddress = memo.from;

        console.log(`At ${timestamp}, ${tipper} with address ${tipperAddress} said: "${message}"`);
    }
}

async function main() {

    const [owner, tipper, tipper2, tipper3] = await hre.ethers.getSigners();

    const BuyMeACoffee = await hre.ethers.getContractFactory("BuyMeACoffee");
    const buyMeACoffee = await BuyMeACoffee.deploy();

    await buyMeACoffee.deployed();
    console.log("BuyMeACoffee deployed to:", buyMeACoffee.address);

    const addresses = [owner.address, tipper.address, tipper2.address, tipper3.address, buyMeACoffee.address];
    console.log("=== start ===");
    await printBalances(addresses);

    const tip = { value: hre.ethers.utils.parseEther("1") };
    await buyMeACoffee.connect(tipper).buyCoffee("Patrick", "You are awesome", tip);
    await buyMeACoffee.connect(tipper2).buyCoffee("Vitto", "You are awesome", tip);
    await buyMeACoffee.connect(tipper3).buyCoffee("Nader", "You are awesome", tip);

    console.log("=== Bought Coffee ===");
    await printBalances(addresses);

    await buyMeACoffee.connect(owner).withdrawTips();

    console.log("=== Withdraw Tips ==");
    await printBalances(addresses);

    console.log("=== Memos ===");
    const memos = await buyMeACoffee.getMemos();
    printMemos(memos);

}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });