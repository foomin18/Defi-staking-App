import React, {Component} from 'react';

class Airdrop extends Component {
    //いくらかステーキングするとカウントダウンを開始するタイマー関数

    constructor() {
        super();
        this.state = {time: 0, seconds: 20};
        this.timer = 0;
        this.startTimer = this.startTimer.bind(this);
        this.countDown = this.countDown.bind(this);
    }

    startTimer() {
        if(this.timer == 0 && this.state.seconds > 0) {
            this.timer = setInterval(this.countDown, 1000) //1000msごとにthis.countDownを実行
        }
    }

    countDown() {  //1秒カウントダウンする関数
        let seconds = this.state.seconds - 1;
        this.setState({
            time: this.secondsToTime(seconds),
            seconds: seconds
        });
        if(seconds == 0) {
            clearInterval(this.timer);  //グローバルメソッドsetIntervalをやめる
        }
    }

    secondsToTime(secs) {
        let hours, minutes, seconds;
        hours = Math.floor(secs / (60 * 60)); //切り捨て

        let devisor_for_minutes = secs % (60 * 60); //3600秒以下抜きだし
        minutes = Math.floor(devisor_for_minutes / 60);

        let devisor_for_seconds = secs % 60; //60秒以下抜きだし
        seconds = Math.ceil(devisor_for_seconds);  //切り上げ

        let obj = {
            'h': hours,
            'm': minutes,
            's': seconds
        }

        return obj;
    }

    componentDidMount() {
        let timeLeftVar = this.secondsToTime(this.state.seconds);
        this.setState({time: timeLeftVar});
    }

    airdropReleaseTokens() {
        let stakingB = this.props.stakingBalance;  //Mainからのprops
        if(stakingB >= '50000000000000000000') {
            this.startTimer();
        }
    }

    render() {
        //this.props.issueRWD();
        this.airdropReleaseTokens();
        return(
            <div style={{color: 'black'}}>
                {this.state.time.m}:{this.state.time.s}
            </div>
        )
    }
}

export default Airdrop;