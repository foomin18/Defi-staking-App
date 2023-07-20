import React, {Component} from 'react';
import './App.css';
import Navbar from './Navbar';
import Web3 from 'web3';
import Main from './Main';
import Tether from '../truffle_abis/Tether.json';
import RWD from '../truffle_abis/RWD.json';
import DecentralBank from '../truffle_abis/DecentralBank.json';
import ParticleSettings from './ParticleSettings';

class App extends Component {

    async componentWillMount() {
        await this.loadweb3();  //web3をload
        await this.loadBlockchainData();
    }

    async loadweb3() {
        if (window.ethereum) {  //ethereumを探知したら
            window.web3 = new Web3(window.ethereum);  //インスタンス生成
            await window.ethereum.enable();  //window.ethereumを有効にする
        } else if (window.web3) {  //windowにweb3を検知
            window.web3 = new Web3(window.web3.currentProvider);  //現在のプロバイダを使用
        } else {
            window.alert('No ethereum browser detected. Yo can check out Metamask.');
        }
    }
    
    loadBlockchainData = async () => {  //参照元がブロックチェーンではないものは非同期要らず
        const web3 = window.web3;
        const account = await web3.eth.getAccounts()  //web3からethereumのメタマスクアカウントを引き出す
        this.setState({account: account[0]});  //stateを読み取ったアカウントで更新
        const networkId = await web3.eth.net.getId();  //blockchainnetworkIdを取得

        //Tether contractをload
        const tetherData = Tether.networks[networkId];  //networksのnetworkId(5777)プロパティから持ってくる
        if (tetherData) {
            // Tether.jsonファイルのabiプロパティとtetherDataのaddressを使ってコントラクトをインスタンス化
            const tether = new web3.eth.Contract(Tether.abi, tetherData.address);
            this.setState({tether});
            let tetherBalance = await tether.methods.balanceOf(this.state.account).call();
            this.setState({tetherBalance: tetherBalance.toString()});
        } else {
            window.alert('Error! Tether contract is not deployed - no detected network!');
        }

        //RWD contractをload
        const rwdData = RWD.networks[networkId];  //networksのnetworkId(5777)プロパティから持ってくる
        if (rwdData) {
            // RWD.jsonファイルのabiプロパティとRWDDataのaddressを使ってコントラクトをインスタンス化
            const rwd = new web3.eth.Contract(Tether.abi, rwdData.address);
            this.setState({rwd});
            let rwdBalance = await rwd.methods.balanceOf(this.state.account).call();
            this.setState({rwdBalance: rwdBalance.toString()});
        } else {
            window.alert('Error! RWD contract is not deployed - no detected network!');
        }

        //DecentralBank contractをload
        const decentralBankData = DecentralBank.networks[networkId];  //networksのnetworkId(5777)プロパティから持ってくる
        if (decentralBankData) {
            // DecentralBank.jsonファイルのabiプロパティとDecentralBankDataのaddressを使ってコントラクトをインスタンス化
            const decentralBank = new web3.eth.Contract(DecentralBank.abi, decentralBankData.address);
            this.setState({decentralBank});
            let stakingBalance = await decentralBank.methods.stakingBalance(this.state.account).call();
            this.setState({stakingBalance: stakingBalance.toString()});
        } else {
            window.alert('Error! DecentralBank contract is not deployed - no detected network!');
        }

        this.setState({loading: false});  //loadが終わる
    }

    stakeTokens = (amount) => {  //非同期処理でstakeToken関数を実装
        this.setState({loading: true});
        this.state.tether.methods.approve(this.state.decentralBank._address, amount).send({from: this.state.account})
        .on('transactionHash', (hash) => {  //transactionHashを送信
            //アカウントから銀行に対するtransactionの承認が終わったら
            this.state.decentralBank.methods.depositTokens(amount).send({from: this.state.account})
            .on('transactionHash', (hash) => { 
                //depositが終わったら
                this.setState({loading: false});
            })
        });
    }

    unstakeTokens = () => {
        this.setState({loading: true});
        this.state.decentralBank.methods.unstakeTokens().send({from: this.state.account})
        .on('transactionHash', (hash) => {
            this.setState({loading: false});
        });
    }

    // issueRWD = () => {
    //     this.setState({loading: true});
    //     this.state.decentralBank.methods.issueTokens().send({from: this.state.account})
    //     .on('transactionHash', (hash) => {
    //         this.setState({loading: false});
    //     });
    // }

    constructor(props) {
        super(props);
        this.state = {
            account: '0x0',
            tether: {},
            rwd: {},
            decentralBank: {},
            tetherBalance: '0',
            rwdBalance: '0',
            stakingBalance: '0',
            loading: true
        };
    }

    render() {
        let content;
        // すべてのコントラクトをロードしてからMainに行く
        {this.state.loading ? 
            content = <p id='loader' className='text-center' style={{margin: '30px', color: 'white'}}>
            LOADING PLEASE...
            </p> 
            : content = <Main
            tetherBalance={this.state.tetherBalance}
            rwdBalance={this.state.rwdBalance}
            stakingBalance={this.state.stakingBalance}
            stakeTokens={this.stakeTokens}
            unstakeTokens={this.unstakeTokens}
            issueRWD={this.issueRWD}
            />
        }

        return (
            <div className='App' style={{position: 'relative'}}>
                <div style={{position: 'absolute'}}>
                    <ParticleSettings/>
                </div>
                <Navbar account={this.state.account}/>
                <div className='container-fluid mt-5'>
                    <div className='row'>
                        <main role='main' className='col-lg-12 ml-auto mr-auto' style={{maxWidth: '600px', minHeight: '100vm'}}>
                            <div>
                                {content}
                            </div>
                        </main>
                    </div>
                </div>
            </div>
        )
    }
} 

export default App;