pragma solidity ^0.5.16;

contract RWD {
    string public name = 'Reward Token';
    string public symbol = 'USDT';
    uint256 public totalSupply = 1000000000000000000000000;  //1million token単位はwei
    uint8 public decimals = 18;

    event Transfer(
        address indexed _from,
        address indexed _to,
        uint _value
    );

    //送信者が開発者でない不正防止のため場合承認システムがほしい
    event Approval(  
        address indexed _owner,
        address indexed _spender,
        uint _value
    );

    mapping(address => uint256) public balanceOf; //addressの所持トークンを確認
    mapping(address => mapping(address => uint256)) public allowance; //キー 一つに複数の値を持たせる

    constructor() public {
        balanceOf[msg.sender] = totalSupply; //ownerのbalanceをtotalに
    }

    //msg.sender(関数の呼び出し元)からtransferする関数
    function transfer(address _to, uint256 _value) public returns (bool success) {
        require(balanceOf[msg.sender] >= _value);
        balanceOf[msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(msg.sender, _to, _value); //eventをemit
        return true;
    }

    function approve(address _spender, uint256 _value) public returns (bool success) {
        allowance[msg.sender][_spender] = _value;  //msg.senderが_spenderが自分に代わって送れるトークンの量を指定する
        emit Approval(msg.sender, _spender, _value);
        return true;
    }
    
    //msg.sensder(関数の呼び出し元)が_fromに代わって_toにトークンを送る関数
    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success) { 
        require(balanceOf[_from] >= _value);
        require(allowance[_from][msg.sender] >= _value); //_fromがmsg.senderに対して決めた値をオーバーするか判別        
        allowance[_from][msg.sender] -= _value;
        balanceOf[_to] += _value;
        emit Transfer(_from, _to, _value);
        return true;
    }
}