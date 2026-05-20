import React from "react";
import { Navigate } from "react-router-dom";

const AuthProtectedRoute = (props: any) => {
    let authToken = sessionStorage.getItem("Token") as string
    if (!authToken) {
        return (
            <Navigate to={{ pathname: "/signin" }} />
        );
    }
    return (<React.Fragment>
        {props.children}
    </React.Fragment>);
};

export default AuthProtectedRoute;