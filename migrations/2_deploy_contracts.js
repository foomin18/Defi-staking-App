// Tetherをdeployする
// artifactsはabisにあるcontract artifacts形式のjsonファイル(abi)のこと?
const RWD = artifacts.require('RWD');
const Tether = artifacts.require('Tether'); 
const DecentralBank = artifacts.require('DecentralBank');

module.exports = async function(deployer, network, accounts) { //async非同期関数promise
    //Mock Tether contractをdeploy
    await deployer.deploy(Tether);  //deployerがresolveを返す(deployが完了する)のを待つ
    const tether = await Tether.deployed();  //deployを待って(await)からインスタンス生成

    //RWD contractをdeploy
    await deployer.deploy(RWD);
    const rwd = await RWD.deployed();

    //DecentralBank contractをdeploy
    await deployer.deploy(DecentralBank, rwd.address, tether.address); //constructorに渡す引数をコントラクトの名前の後に入れる
    const decentralBank = await DecentralBank.deployed();

    //すべてのreward tokenをdecentral bankに移動させる
    await rwd.transfer(decentralBank.address, '1000000000000000000000000');

    //decentral bankに来たユーザまたは投資者に自動的に100tether tokenを与える
    await tether.transfer(accounts[1], '100000000000000000000');
    await tether.transfer(accounts[2], '100000000000000000000');
    await tether.transfer(accounts[3], '100000000000000000000');
    await tether.transfer(accounts[4], '100000000000000000000');
    await tether.transfer(accounts[5], '100000000000000000000');
    await tether.transfer(accounts[6], '100000000000000000000');
    await tether.transfer(accounts[7], '100000000000000000000');
    await tether.transfer(accounts[8], '100000000000000000000');
    await tether.transfer(accounts[9], '100000000000000000000');
};