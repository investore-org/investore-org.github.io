import React, {Component} from "react";
import config from "../config";

export default class Login extends Component {

    constructor(props) {
        super(props);
        this.state = {}
    }

    componentDidMount() {
        fetch(config.apiUrl + "/user")
            .catch(console.error)
            .then(data => {
                this.setState({
                    user: data,
                })
            })
    }

    render() {
        const githubUrl = `${config.apiUrl}/oauth2/authorization/github`;
        const isAuthenticated = !!this.state.user;

        const onLogout = () => {
            fetch(config.apiUrl + "/logout")
                .catch(console.error)
                .then(() => {
                    this.setState({
                        user: null,
                    })
                })
        }

        return (
            <div className={"login-container"}>{
                isAuthenticated
                    ? (<div className="container authenticated" style={{display: 'none'}}>
                        <div>Logged in as: <span id="user">{this.state.user.name}</span></div>
                        <div>
                            <button onClick={onLogout} className="btn btn-primary">Logout</button>
                        </div>
                    </div>)
                    : (<div className="container unauthenticated">
                        With GitHub: <a href={githubUrl}>click here</a>
                    </div>)
            }
            </div>
        );
    }
}
