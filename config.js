require("dotenv").config()

exports.config = {
    PrivateKey: process.env.PRIVATE,
    RPC_URL: process.env.RPC_URL,
    ArbitrageContractAddress: "Your Contract",
    FlashloanPool: "0x0fe261aeE0d1C4DFdDee4102E82Dd425999065F4",
    StartingToken: {
        Name: "WBNB",
        Address: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c"
    },
    Exchanges: [
        {
            Name: "MDEX",
            Router: "0x7DAe51BD3E3376B8c7c4900E9107f12Be3AF1bA8",
            Factory: "0x3CD1C46068dAEa5Ebb0d3f55F6915B10648062B8",
        },
        {
            Name: "PancakeSwap",
            Router: "0x10ED43C718714eb63d5aA57B78B54704E256024E",
            Factory: "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
        },
    ],
    Tokens: [
        {
            Name: "USDT",
            Address: "0x55d398326f99059fF775485246999027B3197955"
        },
        {
            Name: "ETH",
            Address: "0x2170Ed0880ac9A755fd29B2688956BD959F933F8"
        },
        {
            Name: "BTCB",
            Address: "0x7130d2A12B9BCbFAe4f2634d864A1Ee1Ce3Ead9c"
        },
        {
            Name: "ALPACA",
            Address: "0x8F0528cE5eF7B51152A59745bEfDD91D97091d2F"
        },
        {
            Name: "LINK",
            Address: "0xF8A0BF9cF54Bb92F17374d9e9A321E6a111a51bD"
        },
        {
            Name: "BUSD",
            Address: "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"
        },
        {
            Name: "ADA",
            Address: "0x3EE2200Efb3400fAbB9AacF31297cBdD1d435D47"
        },
        {
            Name: "Dot",
            Address: "0x7083609fCE4d1d8Dc0C979AAb8c869Ea2C873402"
        },
        {
            Name: "LUNA",
            Address: "0x156ab3346823B651294766e23e6Cf87254d68962"
        },
        {
            Name: "Cake",
            Address: "0x0E09FaBB73Bd3Ade0a17ECC321fD13a19e81cE82"
        },
        {
            Name: "XRP",
            Address: "0x1D2F0da169ceB9fC7B3144628dB156f3F6c60dBE"
        },
        {
            Name: "MDEX",
            Address: "0x9C65AB58d8d978DB963e63f2bfB7121627e3a739"
        },
        {
            Name: "FIL",
            Address: "0x0D8Ce2A99Bb6e3B7Db580eD848240e4a0F9aE153"
        },
    ],
    Amounts:[
        10,
        1000,
        100000
    ]
}

// exports.config = config