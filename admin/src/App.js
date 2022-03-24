import AllUsers from "./pages/users/allUsers";
import AddUser from "./pages/users/addUser";
import EditUser from "./pages/users/editUser";
import AllQuestions from "./pages/questions/allQuestions";
import AddQuestion from "./pages/questions/addQuestion";
import AllComments from "./pages/comments/allComments";
import AddComment from "./pages/comments/addComment";
import AllAnswers from "./pages/answers/allAnswers";
import Login from "./pages/login/login.jsx";
import NavBar from "./pages/NavBar";
import NotFound from "./pages/NotFound";
import CodeForInterview from "./pages/CodeForInterview";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { AuthProvider } from "./context/auth";
import { FetchProvider } from "./context/fetch";
import PrivateRoute from './components/privateRoute'
function App() {
  return (
    <AuthProvider>
      <FetchProvider>
        <BrowserRouter>
          <NavBar />
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={CodeForInterview} />
            <PrivateRoute exact path="/users" component={AllUsers} />
            <PrivateRoute exact path="/users/add" component={AddUser} />
            <PrivateRoute exact path="/users/edit/:id" component={EditUser} />
            <PrivateRoute exact path="/questions" component={AllQuestions} />
            <PrivateRoute exact path="/questions/add" component={AddQuestion} />
            <PrivateRoute exact path="/comments/:question" component={AllComments} />
            <PrivateRoute
              exact
              path="/comments/:question/:answer"
              component={AllComments}
            />
            <PrivateRoute exact path="/comments/add" component={AddComment} />
            <PrivateRoute exact path="/answers/:question" component={AllAnswers} />
            <PrivateRoute exact path="/answers/add" component={AddComment} />
            <Redirect exact from="/logout" to="/login" />
            <Route component={NotFound} />
          </Switch>
        </BrowserRouter>
      </FetchProvider>
    </AuthProvider>
  );
}

export default App;
