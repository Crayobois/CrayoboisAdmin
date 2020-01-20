import React, { useContext } from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import SignIn from "./components/signIn/SignIn";

const RouterComponent = () => {
  return (
    <React.Fragment>
      <Router>
        <Switch>
          <Route path="/connexion" exact render={props => <SignIn {...props} />} />
          <Route
            path="/"
            render={() => (
              <React.Fragment>
                <div>404</div>
                <div>Page not found</div>
              </React.Fragment>
            )}
          />
        </Switch>
      </Router>
    </React.Fragment>
  );
};

export default RouterComponent;
