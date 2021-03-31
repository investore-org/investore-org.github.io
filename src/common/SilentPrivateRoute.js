import React from 'react';
import {Route} from "react-router-dom";
import LoadingIndicator from "./LoadingIndicator";


const SilentPrivateRoute = ({component: Component, authenticated, ...rest}) => (
    <Route
        {...rest}
        render={props =>
            authenticated ? (
                <Component {...rest} {...props} />
            ) : (
                <LoadingIndicator/>
            )
        }
    />
);

export default SilentPrivateRoute
