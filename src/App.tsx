import React from "react";
import "./App.css";
import "primereact/resources/themes/lara-light-teal/theme.css"; //theme
import "primereact/resources/primereact.min.css"; //core css
import "primeicons/primeicons.css"; //icons

import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import AuthenticatedRoute from "./components/auth/AuthenticatedRoute";

import { USER_ADMIN, USER_STAFF, USER_STUDENT } from "./constants";

import PageNotFound from "./components/screens/PageNotFound";
import Authenticate from "./components/screens/Authenticate";
import Admin from "./components/screens/Admin";
import Template from "./components/screens/Admin/Template";
import Home from "./components/screens/Home";
import Discussions from "./components/screens/Forum/Discussions";
import NewDiscussion from "./components/screens/Forum/Form";
import Notices from "./components/screens/Notices";
import TopicApproval from "./components/screens/TopicApproval";
import DocumentDownload from "./components/screens/DocumentDownload";
import GroupRegistration from "./components/screens/GroupRegistration";
import TopicRegistration from "./components/screens/TopicRegistration";
import DocumentSubmission from "./components/screens/DocumentSubmission";

const App = () => {
  return (
    <div>
      <Router>
        <Route exact path="/authenticate" component={Authenticate} />
        <Switch>
          <AuthenticatedRoute
            exact
            path="/"
            component={Home}
            roles={[USER_ADMIN, USER_STAFF, USER_STUDENT]}
          />
          <AuthenticatedRoute
            exact
            path="/admin"
            component={Admin}
            roles={[USER_ADMIN]}
          />
          <AuthenticatedRoute
            exact
            path="/template"
            component={Template}
            roles={[USER_ADMIN]}
          />
          <AuthenticatedRoute
            exact
            path="/discussions"
            component={Discussions}
            roles={[USER_STAFF]}
          />
          <AuthenticatedRoute
            exact
            path="/discussion/new"
            component={NewDiscussion}
            roles={[USER_STUDENT]}
          />
          <AuthenticatedRoute
            exact
            path="/discussion/:id"
            component={NewDiscussion}
            roles={[USER_STAFF]}
          />
          <AuthenticatedRoute
            exact
            path="/group-registration"
            component={GroupRegistration}
            roles={[USER_ADMIN, USER_STUDENT]}
          />
          <AuthenticatedRoute
            exact
            path="/topic-registration"
            component={TopicRegistration}
            roles={[USER_ADMIN, USER_STUDENT]}
          />
          <AuthenticatedRoute
            exact
            path="/document-submission"
            component={DocumentSubmission}
            roles={[USER_ADMIN, USER_STUDENT]}
          />
          <AuthenticatedRoute
            exact
            path="/notices"
            component={Notices}
            roles={[USER_ADMIN, USER_STAFF, USER_STUDENT]}
          />
          <AuthenticatedRoute
            exact
            path="/approveTopics"
            component={TopicApproval}
            roles={[USER_ADMIN, USER_STAFF, USER_STUDENT]}
          />
          <AuthenticatedRoute
            exact
            path="/downloadDocuments"
            component={DocumentDownload}
            roles={[USER_ADMIN, USER_STAFF, USER_STUDENT]}
          />
          <AuthenticatedRoute
            exact
            path="*"
            component={PageNotFound}
            roles={[USER_ADMIN, USER_STUDENT]}
          />
        </Switch>
      </Router>
    </div>
  );
};

export default App;
