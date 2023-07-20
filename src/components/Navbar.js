import React, {Component} from 'react';
import bank from '../bank.png';

class Navbar extends Component {
    render() {
        return (
            <nav className='navbar navbar-dark fixed-top shadow p-0' 
                 style={{backgroundColor: 'black', height: '50px'}}>
                <a style={{color: 'white'}}>&nbsp;<img src={bank} width='50' height='30' className='d-inline-block align-top' alt='bank'/> 
                &nbsp;DApp Yield Staking (Decentralized banking)
                </a>
                <ul className='navbar-nav px-3'>
                    <li className='text-nowrap d-none nav-item s-sm-none d-sm-block'>
                        <small style={{color: 'white'}}>ACCOUNT NUMBER: {this.props.account}
                        </small>
                    </li>
                </ul>
            </nav>
        )
    }
} 

export default Navbar;