import React, {Component} from 'react';
import './Home.css';
import HomeAuthorized from "./HomeAuthorized";
import HomeAnonymous from "./HomeAnonymous";

class Home extends Component {
    render() {
        console.log("authenticated in home", this.props.authenticated);
        return this.props.authenticated ? <HomeAuthorized/> : <HomeAnonymous/>
    }
}

export default Home;
