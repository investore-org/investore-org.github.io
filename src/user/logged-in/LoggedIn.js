import React, {Component} from 'react';
import './LoggedIn.css';
import userService from "../UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import {Redirect} from "react-router-dom";

class LoggedIn extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        this.setState({userBalance: userService.getUserBalance(this.props.currentUser)});
    }

    render() {
        if (!this.state.userBalance) {
            return <LoadingIndicator/>
        }
        return <Redirect to={{
            pathname: (this.state.userBalance.activeBalance > 0 || this.state.userBalance.demoBalance > 0)
                ? "/" : "/pop-up",
            state: {from: this.props.location}
        }}/>;
    }
}

export default LoggedIn
