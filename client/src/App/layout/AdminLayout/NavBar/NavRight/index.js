import React, { Component } from 'react';
import {Dropdown} from 'react-bootstrap';

import ChatList from './ChatList';
import Aux from "../../../../../hoc/_Aux";
import DEMO from "../../../../../store/constant";

import Avatar1 from '../../../../../assets/images/user/avatar-1.jpg';
import Avatar2 from '../../../../../assets/images/user/avatar-2.jpg';
import Avatar3 from '../../../../../assets/images/user/avatar-3.jpg';

import axios from 'axios';

class NavRight extends Component {
    state = {
        listOpen: false
    };

    logout = () => {
      axios.post('/auth/logout', { withCredentials: true })
        .then(() => window.location.href = '/')
        .catch(console.error)
    }

    render() {

        return (
            <Aux>

                <ul className="navbar-nav ml-auto">
                    <li>
                        <Dropdown alignRight={!this.props.rtlLayout} className="drp-user">
                            <Dropdown.Toggle variant={'link'} id="dropdown-basic">
                                <i className="icon feather icon-settings"/>
                            </Dropdown.Toggle>
                            <Dropdown.Menu alignRight className="profile-notification">
                                <div className="pro-head">
                                    <img src={Avatar1} className="img-radius" alt="User Profile"/>
                                    <span>{sessionStorage.getItem('username')}</span>
                                </div>
                                <ul className="pro-body">
                                    <li><a onClick={this.logout} href='javascript:void(0)' className="dropdown-item"><i className="feather icon-settings"/> Logout</a></li>
                                </ul>
                            </Dropdown.Menu>
                        </Dropdown>
                    </li>
                </ul>
            </Aux>
        );
    }
}

export default NavRight;
