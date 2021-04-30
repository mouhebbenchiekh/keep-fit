import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.9.0";

// pages for this product
import Components from "views/Components/Components.js";
import LandingPage from "views/LandingPage/LandingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import SignupPage from "views/LoginPage/SignupPage";
import ParkPage from "views/ProfilePage/ParkPage.js";
import ParksPage from "views/ListPage/ParksPage.js";
import Store from "Reducer/Store";

var hist = createBrowserHistory();

ReactDOM.render(
  <Store>
  <Router history={hist}>
    <Switch>
      <Route path="/landing-page" component={LandingPage} />
      <Route path="/profile-page" component={ProfilePage} />
      <Route path="/park-page" component={ParkPage} />
      <Route path="/login-page" component={LoginPage} />
      <Route path="/signup-page" component={SignupPage} />
      <Route path="/Parks" component={ParksPage} />
      <Route path="/" component={LandingPage} />
    </Switch>
  </Router>
  </Store>,
  document.getElementById("root")
);