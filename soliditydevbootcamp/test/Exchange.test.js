import { EVM_REVERT, ETHER_ADDRESS, tokens } from './helpers'

const Exchange = artifacts.require('./Exchange')
const Token = artifacts.require('./Token')

require('chai')
    .use(require('chai-as-promised'))
    .should()


contract('Exchange', ([deployer, feeAccount, user1]) =>{
    let token
    let exchange
    const feePercent = 10

    beforeEach(async ()=> {
        token = await Token.new()
        token.transfer(user1, tokens(100), {from:deployer})
        exchange = await Exchange.new(feeAccount,feePercent)
    })

    describe('deployment', () => {
        it('feeAccount is correct', async()=> {  
            const result = await exchange.feeAccount()
            result.should.equal(feeAccount)
        })
        it('feePercent is correct', async()=> {
            const result = await exchange.feePercent()
            result.toString().should.equal(feePercent.toString())
        })
        
    })

    describe('fallback', () => {
        it('reverts when Ether is sent', async ()=> {
            await exchange.sendTransaction({ value: 1, from: user1}).should.be.rejectedWith(EVM_REVERT);
        })
    })
    
    describe('depositing Ether',() => {
        let result
        let amount = tokens(1)

        beforeEach(async ()=>{
            await token.approve(exchange.address, amount, {from: user1})
            result = await exchange.depositEther({from: user1, value: amount})
        })
        it('tracks the Ether deposit', async ()=> {
            let balance
            balance = await exchange.tokens(ETHER_ADDRESS, user1)
            balance.toString().should.equal(amount.toString())
        })
        it('emits a Deposit event', async () => {
            const log = result.logs[0]
            log.event.should.eq('Deposit')
            const event = log.args
            event.token.toString().should.eq(ETHER_ADDRESS, 'token address is correct')
            event.user.toString().should.eq(user1, 'depositer is correct')
            event.amount.toString().should.eq(amount.toString(), 'amount to deposit value is correct')
            event.balance.toString().should.eq(amount.toString(), 'new balance value is correct')
        })
    })

    describe('withdraw Ether',() => {
        let result
        let amount = tokens(1)

        beforeEach(async ()=>{
            // Deposit first
            await token.approve(exchange.address, amount, {from: user1})
            result = await exchange.depositEther({from: user1, value: amount})
        })
        
        describe('success', async ()=> {
            beforeEach(async () => {
                //Withdraw Ether
                result = await exchange.withdrawEther(amount, {from: user1})
            })

            it('withdraws Ether funds', async ()=> {
                const balance = await exchange.tokens(ETHER_ADDRESS, user1)
                balance.toString().should.equal('0')
            })
            it('emits a Withdraw event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Withdraw')
                const event = log.args
                event.token.toString().should.eq(ETHER_ADDRESS, 'token address is correct')
                event.user.toString().should.eq(user1, 'depositer is correct')
                event.amount.toString().should.eq(amount.toString(), 'amount to withdraw value is correct')
                event.balance.toString().should.eq('0', 'new balance value is correct')
            })
        })

        describe('failure', async ()=> {
            it('rejects withdraws for insufficient funds', async ()=>{
                await exchange.withdrawEther(tokens(1000), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('depositing tokens',() => {
        let result
        let amount = tokens(10)
        
        describe('success',() => {
            beforeEach(async ()=>{
                await token.approve(exchange.address, amount, {from: user1})
                result = await exchange.depositToken(token.address, amount, {from: user1})
            })

            it('tracks the token deposit', async ()=> {
                let balance
                balance = await token.balanceOf(exchange.address)
                balance.toString().should.equal(amount.toString())
                balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal(amount.toString())
            })
            it('emits a Deposit event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Deposit')
                const event = log.args
                event.token.toString().should.eq(token.address, 'token address is correct')
                event.user.toString().should.eq(user1, 'depositer is correct')
                event.amount.toString().should.eq(amount.toString(), 'amount to deposit value is correct')
                event.balance.toString().should.eq(amount.toString(), 'new balance value is correct')
            })
        })
        describe('failure',() => {
            it('rejects Ether deposits', async () => {
                result = await exchange.depositToken(ETHER_ADDRESS, amount, {from: user1}).should.be.rejectedWith(EVM_REVERT);
            })
            it('fails when not enough tokens are approved', async () => {
                result = await exchange.depositToken(token.address, amount, {from: user1}).should.be.rejectedWith(EVM_REVERT);
            })
        })
    })

    describe('withdraw Token',() => {
        let result
        let amount = tokens(1)

        describe('success', async ()=> {
            beforeEach(async () => {
                // Deposit first
                await token.approve(exchange.address, amount, {from: user1})
                result = await exchange.depositToken(token.address, amount, {from: user1})
                //Withdraw Token
                result = await exchange.withdrawToken(token.address, amount, {from: user1})
            })
            it('withdraws Token funds', async ()=> {
                const balance = await exchange.tokens(token.address, user1)
                balance.toString().should.equal('0')
            })
            it('emits a Withdraw event', async () => {
                const log = result.logs[0]
                log.event.should.eq('Withdraw')
                const event = log.args
                event.token.toString().should.eq(token.address, 'token address is correct')
                event.user.toString().should.eq(user1, 'depositer is correct')
                event.amount.toString().should.eq(amount.toString(), 'amount to withdraw value is correct')
                event.balance.toString().should.eq('0', 'new balance value is correct')
            })
        })

        describe('failure', async ()=> {
            it('rejects Ethers withdraws', async ()=>{
                result = await exchange.withdrawToken(token.address, amount, {from: user1}).should.be.rejectedWith(EVM_REVERT);
            })
            it('rejects withdraws for insufficient funds', async ()=>{
                await exchange.withdrawToken(token.address, tokens(1000), {from: user1}).should.be.rejectedWith(EVM_REVERT)
            })
        })
    })

    describe('checking balances', () => {
        beforeEach(async ()=> {
            exchange.depositEther({from:user1, value:tokens(1)})
        })
        it('returns user balance', async ()=>{
            const result = await exchange.balanceOf(ETHER_ADDRESS, user1)
            result.toString().should.equal(tokens(1).toString())
        })
    })

})