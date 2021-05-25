import React, {Component} from 'react';
import userService from "../UserService";
import {Link, Redirect} from "react-router-dom";
import "../pop-up/PopUp.css";

class DemoDeposit extends Component {
    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
    }

    render() {
        // if (!this.state?.wallet) {
        //     return <LoadingIndicator/>
        // }
        console.log("wallet", this.state.wallet);
        if (this.state?.wallet?.demoBalance > 0) {
            return <Redirect to={{
                pathname: "/",
                state: {from: this.props.location}
            }}/>;
        }
        const onDemoMoneyRequested = () => {
            userService.requestDemoDeposit(this.props.currentUser)
                .catch(console.error)
                .then(wallet => this.setState({wallet: wallet}));
        }
        return (
            <div className="pop-up-container">
                <h1 className="title">
                    Demo
                </h1>
                <div className="desc">
                    Proceed to get $500 on your demo balance
                </div>
                <div className={"deposit-button-container"}>
                    <button className="positive-btn btn btn-primary"
                            onClick={() => onDemoMoneyRequested()}
                            type="button">Proceed
                    </button>
                </div>
                <div className={"deposit-button-container"}>
                    <Link to="/">
                        <button className="go-back-btn btn btn-primary" type="button">Go Back</button>
                    </Link>
                </div>
            </div>
        )
    }
}

export default DemoDeposit
