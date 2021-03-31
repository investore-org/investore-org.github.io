import React, {Component} from 'react';
import userService from "../UserService";
import LoadingIndicator from "../../common/LoadingIndicator";
import {Redirect} from "react-router-dom";

class DemoDeposit extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        console.log("props in DemoDeposit mount", this.props);
        userService.requestDemoDeposit(this.props.currentUser)
            .catch(console.error)
            .then(wallet => this.setState({wallet: wallet}));
    }

    render() {
        console.log("props in DemoDeposit", this.props)
        console.log("state in DemoDeposit", this.state)
        if (!this.state?.wallet) {
            return <LoadingIndicator/>
        }
        return <Redirect to={{
            pathname: (this.state.wallet.demoBalance > 0) ? "/" : "/pop-up",
            state: {from: this.props.location}
        }}/>;
    }
}

export default DemoDeposit
