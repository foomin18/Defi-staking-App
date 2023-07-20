pragma solidity ^0.5.16;

import './RWD.sol';
import './Tether.sol';
// tetherとRWDにaccessできるようにして、それらを常にtrackする
// tokenを発行して、状態をtrackし、預金depositや引き出すwithdrawできる

contract DecentralBank {
    string public name = 'Decentral Bank';
    address public owner;
    Tether public tether;
    RWD public rwd;

    ////stakingトラッキング用array
    address[] public stakers;

    //stakingトラッキング用mappingたち
    mapping(address => uint) public stakingBalance;
    mapping(address => bool) public hasStaked;  // stakeしたことがあるか
    mapping(address => bool) public isStaking;  // stakeを今しているか

    constructor(RWD _rwd, Tether _tether) public {
        rwd = _rwd;
        tether = _tether;
        owner = msg.sender;
    }

    function depositTokens(uint _amount) public {
        // 0 がstakingされることを防ぐ
        require(_amount > 0, 'amount cannnot be ZERO');

        // 関数を呼んでいるユーザのTetherをstakingのためにDecentralBank addressに送る
        tether.transferFrom(msg.sender, address(this), _amount);  //address(this)でこのコントラクトのアドレス
        
        //stakingBalanceを更新
        stakingBalance[msg.sender] += _amount;

        if(!hasStaked[msg.sender]) {
            stakers.push(msg.sender);
        }

        hasStaked[msg.sender] = true;
        isStaking[msg.sender] = true;
    }

    function issueTokens() public {
        require(msg.sender == owner, 'The caller must be owner.');

        for (uint i = 0; i < stakers.length; i++) {
            address recipient = stakers[i];
            uint balance = stakingBalance[recipient] / 9;  //incentiveを作る
            if (balance > 0) {
                rwd.transfer(recipient, balance);  //msg.senderはbank address
            }
        }
    }

    function unstakeTokens() public { //invester address から呼び出す
        uint balance = stakingBalance[msg.sender];
        require(balance > 0, 'staking balance cannot be less than zero');
        tether.transfer(msg.sender, balance);  //bankからinvesterにTetherを返す msg.senderはbank address
        stakingBalance[msg.sender] = 0;
        isStaking[msg.sender] = false;
    }
}