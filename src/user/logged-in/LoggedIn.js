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
        userService.getUserBalance(this.props.currentUser)
            .catch(console.error)
            .then(balance => this.setState({userBalance: balance}));
    }

    render() {
        if (!this.state.userBalance) {
            return <LoadingIndicator/>
        }
        console.log("wallet", this.state.userBalance);
        return <Redirect to={{
            pathname: (this.state.userBalance.activeBalance > 0 || this.state.userBalance.demoBalance > 0)
                ? "/" : "/no-balance",
            state: {from: this.props.location}
        }}/>;
    }
}

export default LoggedIn
