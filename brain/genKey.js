const { Wallet } = require('ethers'); const w = Wallet.createRandom(); console.log('PRIVATE_KEY=' + w.privateKey); console.log('ADDRESS=' + w.address);
