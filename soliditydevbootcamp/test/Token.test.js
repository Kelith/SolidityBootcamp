import { EVM_REVERT, tokens } from './helpers'

const Token = artifacts.require('./Token')

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Token', ([deployer, receiver]) =>{
    const name = "JoJo Coin"
    const symbol = "JJC"
    const decimals = "18"
    const totalSupply = tokens(1000000).toString()
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
            result.toString().should.equal(totalSupply.toString())
        })
        it('assign total supply to the deployer', async()=> {  
            const result = await token.balanceOf(deployer) 
            result.toString().should.equal(totalSupply.toString())
        })


    })

    describe('sending token', () => {
        let amount
            let result
            beforeEach(async ()=> {
                amount = tokens(100)
                // Tranfer
                result = await token.transfer(receiver, amount, { from: deployer})
            })

        describe('success', () => {

            it('transfers token balances', async () => {
                let balanceOf
                // Balance after transfer
                balanceOf = await token.balanceOf(receiver)
                balanceOf = await token.balanceOf(deployer)
            })
            it('emits a transfer event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Transfer')
                const event = log.args
                event.from.toString().should.eq(deployer, 'from value is correct')
                event.to.toString().should.eq(receiver, 'to value is correct')
                event.value.toString().should.eq(amount.toString(), '"value" value is correct')
            })
        })
        describe('failure', () => {
            it('rejects insufficient balances', async ()=>{
                let invalidAmount
                invalidAmount = tokens(100000000) //100million is greater than total supply
                await token.transfer(receiver,invalidAmount, {from:deployer}).should.be.rejectedWith(EVM_REVERT);

                //Attempt to transfer tokens when you don't have enough
                invalidAmount = tokens(1000) //receiver has not enough token
                await token.transfer(receiver,invalidAmount, {from:receiver}).should.be.rejectedWith(EVM_REVERT);
            })

            it('rejects invalid receiver', async ()=>{
                await token.transfer(0x0, amount, {from: deployer}).should.be.rejectedWith('invalid address');
            })
        })
        
    })

})