
const Token = artifacts.require('./Token')

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Token', (accounts) =>{
    const name = "JoJo Coin"
    const symbol = "JJC"
    const decimals = "18"
    const totalSupply = "1000000000000000000000000"
    let token
    beforeEach(async ()=> {
        token = await Token.new()     //or await Token.deployed() if it was already deployed
    })

    describe('deployment', () => {
        it('name is correct', async()=> {   //need async because of await!
            const result = await token.name()     //name() is a get function that solidity automatically write because name was public!
            result.should.equal(name)
        })
        it('symbol is correct', async()=> {  
            const result = await token.symbol() 
            result.should.equal(symbol)
        })
        it('decimals are correct', async()=> {  
            const result = await token.decimals() 
            result.toString().should.equal(decimals)
        })
        it('total supply is correct', async()=> {  
            const result = await token.totalSupply() 
            result.toString().should.equal(totalSupply)
        })

    })


})