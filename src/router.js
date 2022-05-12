import React from 'react'
import {Switch, Route, Redirect} from 'react-router-dom'
import {Login} from "./pages/Login";
import {MainPage} from "./pages/MainPage";



export const useRoutes = isAuthenticated => {
    if (isAuthenticated) {
        return (
            <Switch>
                <Route path="/article" component={MainPage}/>
                <Redirect to={"/article"}/>
            </Switch>
        )
    }
    return (
        <Switch>
            <Route path="/" exact>
                <Login />
            </Route>
            <Redirect to="/" />
        </Switch>
    )
}
