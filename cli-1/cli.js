// Import
const { ApiPromise, WsProvider } = require('@polkadot/api');
const process = require('process');

const yargs = require("yargs");
const { number } = require('yargs');

const options = yargs
.usage("Usage: -h <hash>")
.option("h", { alias: "hash", describe: "block hash", type: "string" })
.usage("Usage: -n <number>")
.option("n", { alias: "number", describe: "block number", type: "number" })
.argv;

console.log(options);
const wsProvider = new WsProvider('wss://rpc.polkadot.io');

async function initAPI() {
    const api = await ApiPromise.create({ provider: wsProvider });
    
    
    if (!options.number && !options.hash) {
        const signedBlock = await api.rpc.chain.getBlock();
        console.log(`Last block is => | ${signedBlock.block.header.number} | ${signedBlock.hash} `)  
        process.exit(0);
    } else {
        if(options.number) {
            
            let blockHash = await api.rpc.chain.getBlockHash(options.number);
            const signedBlock = await api.rpc.chain.getBlock(blockHash);
            console.log(`block By Number (${options.number})-> ${signedBlock.block.header.hash.toHex()}`);
            process.exit(0);
        } else {
            if(options.hash) {
                const signedBlock = await api.rpc.chain.getBlock(options.hash);
                console.log(`block By Hash (${options.hash}) -> ${JSON.stringify(signedBlock.block.header)}`);
            }
        }
        
    }
    
}


function init() {
    initAPI()
    
}

init();