import AllUsers from "./pages/users/allUsers";
import AddUser from "./pages/users/addUser";
import EditUser from "./pages/users/editUser";
import AllQuestions from "./pages/questions/allQuestions";
import AllComments from "./pages/comments/allComments";
import AllAnswers from "./pages/answers/allAnswers";
import AllCensorship from "./pages/censorship/allCensorship";
import AllReport from "./pages/reports/allReport";
import UserReport from "./pages/reports/userReport";
import Login from "./pages/login/login.jsx";
import NavBar from "./pages/NavBar";
import NotFound from "./pages/NotFound";
import CodeForInterview from "./pages/CodeForInterview";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { FetchProvider } from "./context/fetch";
import Header from "./pages/header";
import PrivateRoute from "./components/privateRoute";
function App() {
  return (
    <AuthProvider>
      <FetchProvider>
        <BrowserRouter>
          
          <Header />
          <NavBar />
          <Switch>
            <Route exact path="/login" component={Login} />
           {/*  <PrivateRoute exact path="/" component={CodeForInterview} /> */}
            <PrivateRoute exact path="/users" component={AllUsers} />
            <PrivateRoute exact path="/users/add" component={AddUser} />
            <PrivateRoute exact path="/users/edit/:id" component={EditUser} />
            <PrivateRoute exact path="/questions" component={AllQuestions} />
            <PrivateRoute
              exact
              path="/comments/:question"
              component={AllComments}
            />
            <PrivateRoute
              exact
              path="/comments/:question/:answer"
              component={AllComments}
            />
            <PrivateRoute
              exact
              path="/answers/:question"
              component={AllAnswers}
            />
            <PrivateRoute exact path="/censorship" component={AllCensorship} />
            <PrivateRoute exact path="/report" component={AllReport} />
            <PrivateRoute
              exact
              path="/report/userreport/:id"
              component={UserReport}
            />
            <Redirect exact from="/logout" to="/login" />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </FetchProvider>
    </AuthProvider>
  );
}

export default App;
