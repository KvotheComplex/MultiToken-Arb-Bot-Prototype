const {ethers} = require("ethers")
const arbABI = require("./arbABI.json")
const {config} = require("./config")
// const erc20ABI = require("./erc20ABI.json")
// const uniswapFactoryABI = require("./uniswapFactoryABI.json")
// const uniswapRouterABI = require("./uniswapRouterABI.json")
// const pairABI = require("./pairABI.json")


const uniswapRouterABI = require('@uniswap/v2-periphery/build/IUniswapV2Router02.json').abi
const uniswapFactoryABI = require("@uniswap/v2-core/build/IUniswapV2Factory.json").abi
const pairABI = require("@uniswap/v2-core/build/IUniswapV2Pair.json").abi

let arbAddress = config.ArbitrageContractAddress
let exchanges = config.Exchanges
let private = config.PrivateKey
let tokens = config.Tokens 
let flashloanPoolAddress = config.FlashloanPool

let pancakeSwapRouterAddress = config.Exchanges[1].Router
let pancakeSwapFactoryAddress = config.Exchanges[1].Factory
let MDEXRouterAddress = config.Exchanges[0].Router
let MDEXFactoryAddress = config.Exchanges[0].Factory

let startingToken = config.StartingToken.Address
let startingName = config.StartingToken.Name
let borrowAmount = "20"//WBNB


let provider = new ethers.providers.JsonRpcProvider(config.RPC_URL)

let wallet = new ethers.Wallet(private, provider)

let pancakeRouter = new ethers.Contract(pancakeSwapRouterAddress, uniswapRouterABI, provider)
let pancakeFactory = new ethers.Contract(pancakeSwapFactoryAddress, uniswapFactoryABI, provider)
let mdexRouter = new ethers.Contract(MDEXRouterAddress, uniswapRouterABI, provider)
let mdexFactory = new ethers.Contract(MDEXFactoryAddress, uniswapFactoryABI, provider)

let arbContract = new ethers.Contract(arbAddress, arbABI, wallet)

let executing = false


async function getAmountOutBS(token0, token1,amount){
    try{
        let res = await mdexRouter.getAmountsOut(ethers.utils.parseEther(amount),[token0, token1])
        // console.log(res)
        let formatted  = ethers.utils.formatEther(res[1].toString())
        // console.log(formatted)
        return formatted
    } catch(err) {
        console.error(err)
    }
}

async function getAmountOutPS(token0, token1,amount){
    try{
        let res = await pancakeRouter.getAmountsOut(ethers.utils.parseEther(amount),[token0, token1])
        // console.log(res)
        let formatted  = ethers.utils.formatEther(res[1].toString())
        // console.log(formatted)
        return formatted
    } catch(err) {
        console.error(err)
    }
}

async function execute(startOnUniswap, token0,token1){
    executing = true
    console.log("Executing")
    try{
        let res = await arbContract.executeTrade(
            flashloanPoolAddress,
            startOnUniswap,
            token0,
            token1,
            ethers.utils.parseEther(borrowAmount),
            {gasLimit: 800000, gasPrice: 31000000000}
        )
        console.log(res)
    }catch(err) {
        console.log(err)
    }
    console.log("Searching")

    executing = false
}

async function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}





async function start(){

    while(true){
        for(let i = 0; i< tokens.length; i++){
            if(!executing){

                console.log("Starting on PancakeSwap")
                //get path 1 end result
                let amountOut1 = await getAmountOutPS( startingToken,tokens[i].Address ,borrowAmount)
                console.log(startingName,":", borrowAmount)
                console.log(tokens[i].Name,":", amountOut1)
                if(amountOut1 === undefined){continue}

                console.log("Checking MDEX")
                let amountOut2 = await getAmountOutBS( tokens[i].Address, startingToken ,amountOut1)
                if(amountOut2 === undefined){continue}

                console.log(tokens[i].Name,":", amountOut1)
                console.log(startingName,":", amountOut2)



                console.log("Starting on MDEX")
                //get path 2 end result
                let reverseOut1 = await getAmountOutBS(startingToken,tokens[i].Address ,borrowAmount)
                console.log(startingName,":", borrowAmount)
                console.log(tokens[i].Name,":", reverseOut1)
                if(reverseOut1 === undefined){continue}
                
                console.log("Checking PancakeSwap")
                let reverseOut2 = await getAmountOutPS(tokens[i].Address,startingToken ,reverseOut1)
                console.log(tokens[i].Name,":", reverseOut1)
                console.log(startingName,":", reverseOut2)
                if(reverseOut2 === undefined){continue}


                if(parseInt(reverseOut2) > parseInt(borrowAmount)){
                    //starting on exchange 1
                    console.log("%cExecuting on MDEX .... I think", "color: green")
                    await execute(
                        true,
                        startingToken,
                        tokens[i].Address
                    )
                } else if(parseInt(amountOut2) > parseInt(borrowAmount)){
                    //starting on exchange 2
                    console.log("%cExecuting on PancakeSwap .... I think", "color: green")
                    await execute(
                        false,
                        startingToken,
                        tokens[i].Address
                    )
                }else {
                    //no arb opportunities, waiting before attempting
                    console.log("No opportunities found")
                    // await sleep(10000)
                }
            }
            //regardless wait 1 second(s) between loop
            // await sleep(1000)
        }
    }
}

start()