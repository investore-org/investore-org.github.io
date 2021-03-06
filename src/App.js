import React, {Component} from 'react';
import {Redirect, Route, Switch} from 'react-router-dom';
import AppHeader from './common/AppHeader';
import Home from './home/Home';
import Login from './user/login/Login';
import Signup from './user/signup/Signup';
import Profile from './user/profile/Profile';
import OAuth2RedirectHandler from './user/oauth2/OAuth2RedirectHandler';
import NotFound from './common/NotFound';
import LoadingIndicator from './common/LoadingIndicator';
import {getCurrentUser} from './util/APIUtils';
import {ACCESS_TOKEN} from './constants';
import PrivateRoute from './common/PrivateRoute';
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import './App.css';
import ManualTrading from "./trading/manual/ManualTrading";
import LoggedIn from "./user/logged-in/LoggedIn";
import SilentPrivateRoute from "./common/SilentPrivateRoute";
import PopUp from "./user/pop-up/PopUp";
import DemoDeposit from "./user/demo/DemoDeposit";
import AutoTrading from "./trading/auto/AutoTrading";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            authenticated: false,
            currentUser: null,
            loading: false,
            loggedOut: false,
        }
        // this.loadCurrentlyLoggedInUser = this.loadCurrentlyLoggedInUser.bind(this);
        // this.handleLogout = this.handleLogout.bind(this);
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
            })
            .catch(error => {
                console.error(error);
                this.setState({
                    loading: false
                });
            });
    }

    componentDidMount() {
        this.loadCurrentlyLoggedInUser();
    }

    handleLogout() {
        localStorage.removeItem(ACCESS_TOKEN);
        this.setState({
            authenticated: false,
            currentUser: null,
            loggedOut: true,
        });
        Alert.success("You're safely logged out!");
    }

    render() {
        if (this.state.loggedOut) {
            return <Redirect to={{
                pathname: "/",
                state: {from: this.props.location}
            }}/>;
        }
        let authenticated = this.state.authenticated;
        console.log("authenticated in app", authenticated);

        if (this.state.loading) {
            return (
                <div className="app">
                    <div className="app-top-box">
                        <AppHeader authenticated={authenticated} onLogout={() => this.handleLogout()}/>
                    </div>
                    <LoadingIndicator/>
                </div>
            )
        }
        return (
            <div className="app">
                <div className="app-top-box">
                    <AppHeader authenticated={authenticated} onLogout={() => this.handleLogout()}/>
                </div>
                <div className="app-body">
                    <Switch>
                        <Route exact path="/"
                               render={(props) => (
                                   <Home {...props} authenticated={authenticated}/>
                               )}/>
                        <PrivateRoute path="/profile"
                                      authenticated={authenticated}
                                      currentUser={this.state.currentUser}
                                      component={Profile}/>
                        <Route path="/login"
                               render={(props) => <Login
                                   authenticated={authenticated} {...props} />}/>
                        <Route path="/signup"
                               render={(props) => <Signup
                                   authenticated={authenticated} {...props} />}/>
                        <Route path="/oauth2/redirect" component={OAuth2RedirectHandler}/>
                        <SilentPrivateRoute path="/logged-in"
                                            authenticated={authenticated}
                                            currentUser={this.state.currentUser}
                                            component={LoggedIn}/>
                        <SilentPrivateRoute path="/no-balance"
                                            authenticated={authenticated}
                                            currentUser={this.state.currentUser}
                                            component={PopUp}/>
                        <SilentPrivateRoute path="/demo-deposit"
                                            authenticated={authenticated}
                                            currentUser={this.state.currentUser}
                                            component={DemoDeposit}/>
                        <SilentPrivateRoute path="/manual"
                                            authenticated={authenticated}
                                            currentUser={this.state.currentUser}
                                            component={ManualTrading}/>
                        <SilentPrivateRoute path="/autotrading"
                                            authenticated={authenticated}
                                            currentUser={this.state.currentUser}
                                            component={AutoTrading}/>
                        <Route component={NotFound}/>
                    </Switch>
                </div>
                <Alert stack={{limit: 3}}
                       timeout={3000}
                       position='top-right' effect='slide' offset={65}/>
            </div>
        );
    }
}

export default App;
