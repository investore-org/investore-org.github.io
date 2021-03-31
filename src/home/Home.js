import React, {Component} from 'react';
import './Home.css';
import HomeAuthorized from "./HomeAuthorized";
import HomeAnonymous from "./HomeAnonymous";
import LoadingIndicator from "../common/LoadingIndicator";
import {getCurrentUser} from "../util/APIUtils";

class Home extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    loadCurrentlyLoggedInUser() {
        this.setState({
            loading: true
        });

        getCurrentUser()
            .then(response => {
                this.setState({
                    currentUser: response,
                    authenticated: true,
                    loading: false
                });
            }).catch(error => {
            console.error(error);
            this.setState({
                loading: false
            });
        });
    }

    componentDidMount() {
        this.loadCurrentlyLoggedInUser();
    }

    render() {
        if (this.state.loading) {
            return <LoadingIndicator/>
        }
        if (this.state.authenticated && !this.state.currentUser) {
            return <LoadingIndicator/>
        }
        return this.state.authenticated
            ? <HomeAuthorized {...this.state}/>
            : <HomeAnonymous {...this.state}/>
    }
}

export default Home;
