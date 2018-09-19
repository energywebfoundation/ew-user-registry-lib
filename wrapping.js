var Sloffle = require("sloffle")
const { exec } = require('child_process');

const main = async () => {

    await Sloffle.wrapping("solidity_modules/ew-user-registry-contracts/dist", "dist/ts/wrappedContracts")

}

main()