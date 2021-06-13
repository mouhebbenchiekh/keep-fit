import React from "react";
import ReactDOM from "react-dom";
import { createBrowserHistory } from "history";
import { Router, Route, Switch } from "react-router-dom";

import "assets/scss/material-kit-react.scss?v=1.9.0";

// pages for this product

import LandingPage from "views/LandingPage/LandingPage.js";
import ProfilePage from "views/ProfilePage/ProfilePage.js";
import LoginPage from "views/LoginPage/LoginPage.js";
import SignupPage from "views/LoginPage/SignupPage";
import ParkPage from "views/ProfilePage/ParkPage.js";
import ParksPage from "views/ListPage/ParksPage.js";
import GymsPage from "views/ListPage/GymsPage.js";
import Store from "Reducer/Store";
import GymPage from "views/ProfilePage/GymPage";
import EventsPage from "views/ListPage/eventsPage.js";
import ResultsPage from "views/ListPage/resultsPage";

var hist = createBrowserHistory();

ReactDOM.render(
  <Store>
  <Router history={hist}>
    <Switch>
      <Route path="/landing-page" component={LandingPage} />
      <Route path="/profile-page" component={ProfilePage} />
      <Route path="/park-page" component={ParkPage} />
      <Route path="/gym-page" component={GymPage} />
      <Route path="/login-page" component={LoginPage} />
      <Route path="/signup-page" component={SignupPage} />
      <Route path="/parks" component={ParksPage} />
      <Route path="/gyms" component={GymsPage} />
      <Route path="/events" component={EventsPage} />
      <Route path="/results" component={ResultsPage} />
      <Route path="/" component={LandingPage} />
    </Switch>
  </Router>
  </Store>,
  document.getElementById("root")
);
