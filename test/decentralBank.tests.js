const RWD = artifacts.require('RWD');
const Tether = artifacts.require('Tether'); 
const DecentralBank = artifacts.require('DecentralBank');

require('chai') //ライブラリを持ってくる
.use(require('chai-as-promised'))
.should();

contract('DecentralBank', ([owner, customer]) => { 
    let tether, rwd, decentralBank;

    function tokens(number) {  //Weiに変換する
        return web3.utils.toWei(number, 'ether');
    }

    before(async () => {  //テストの前にする処理
        //Load contracts
        tether = await Tether.new();  //インスタンス生成
        rwd = await RWD.new();
        decentralBank = await DecentralBank.new(rwd.address, tether.address);

        //すべてのrwdトークンをbankに送る
        await rwd.transfer(decentralBank.address, tokens('1000000'));

        //decentral bankに来たユーザまたは投資者に自動的に100tether tokenを与える
        await tether.transfer(customer, tokens('100'), {from: owner});  //謎の三つ目の引数
    })


    //テスト用のコードをすべてここに入れる
    describe('Mock Tether Deployment', async () => { // deployの確認テストmocha
        it('matches name successfully', async () => { //名前があっているかのテスト
            const name = await tether.name();
            assert.equal(name, 'Mock Tether Token');
        })
    })

    describe('Reward Token Deployment', async () => { // deployの確認mocha
        it('matches name successfully', async () => { //名前があっているかのテスト
            const name = await rwd.name();
            assert.equal(name, 'Reward Token');
        })
    })

    describe('decentral Bank Deployment', async () => { // deployの確認mocha
        it('matches name successfully', async () => { //名前があっているかのテスト
            const name = await decentralBank.name();
            assert.equal(name, 'Decentral Bank');
        })

        it('contract has tokens', async () => { //bankが1000000token持ってるかのテスト
            let balance = await rwd.balanceOf(decentralBank.address);
            assert.equal(balance, tokens('1000000'));
        })
    })

    describe('Yield Faming', async () => {
        it('rewards tokens for staking', async () => {
            let result

            // Check Investor Balance
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance before staking')
            
            // Check Staking For Customer of 100 tokens
            await tether.approve(decentralBank.address, tokens('100'), {from: customer})
            await decentralBank.depositTokens(tokens('100'), {from: customer})

            // Check Updated Balance of Customer
            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('0'), 'customer mock wallet balance after staking 100 tokens')     
            
            // Check Updated Balance of Decentral Bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('100'), 'decentral bank mock wallet balance after staking from customer')     
            
            // Is Staking Update
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'true', 'customer is staking status after staking')

            // Issue Tokens
            await decentralBank.issueTokens({from: owner})

            // Ensure Only The Owner Can Issue Tokens
            await decentralBank.issueTokens({from: customer}).should.be.rejected;

            // Unstake Tokens
            await decentralBank.unstakeTokens({from: customer})

            // Check Unstaking Balances

            result = await tether.balanceOf(customer)
            assert.equal(result.toString(), tokens('100'), 'customer mock wallet balance after unstaking')     
            
            // Check Updated Balance of Decentral Bank
            result = await tether.balanceOf(decentralBank.address)
            assert.equal(result.toString(), tokens('0'), 'decentral bank mock wallet balance after unstaking')     
            
            // Is Staking Update
            result = await decentralBank.isStaking(customer)
            assert.equal(result.toString(), 'false', 'customer is no longer staking after unstaking')
        })
    })

})