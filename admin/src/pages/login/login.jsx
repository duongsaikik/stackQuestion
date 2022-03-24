import "./Sliding-Sign-In-Sign-Up-Form-master/style.css";
import "https://kit.fontawesome.com/64d58efce2.js";
import { useContext } from "react";
import { Formik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AuthContext } from "../../context/auth";
import FormInput from "../../components/form-input/index";
const Login = () => {
  const { setAuthState, logout } = useContext(AuthContext);
  const usersUrl = "http://localhost:8080/api";
  return (
    <div>
      <div class="container">
        <div class="forms-container">
          <div class="signin-signup">
            <Formik
              initialValues={{ username: "", password: "" }}
              onSubmit={async (values, { setStatus, resetForm }) => {
                try {
                  const { data } = await axios.post(
                    `${usersUrl}/authenticate`,
                    values
                  );
                  const { token, expiresAt, userInfo } = data;
                  if (userInfo.role === "admin" ) {
                    await setAuthState({ token, expiresAt, userInfo });
                    resetForm({});
                    window.location.href = "/users";
                  } else if(userInfo.role === "checker"){
                    await setAuthState({ token, expiresAt, userInfo });
                    resetForm({});
                    window.location.href = "/censorship";
                  }else{
                    await logout();
                    setStatus("You don't have permission to access this page");
                  }
                } catch (error) {
                  setStatus(error.response.data.message);
                }
              }}
              validationSchema={Yup.object({
                username: Yup.string()
                  .required("Required")
                  .max(16, "Must be at most 16 characters long")
                  .matches(/^[a-zA-Z0-9_-]+$/, "Contains invalid characters"),
                password: Yup.string()
                  .required("Required")
                  .min(6, "Must be at least 6 characters long")
                  .max(50, "Must be at most 50 characters long"),
              })}
            >
              {({
                values,
                errors,
                touched,
                status,
                handleChange,
                handleBlur,
                handleSubmit,
                isSubmitting,
              }) => (
                <form action="#" class="sign-in-form" onSubmit={handleSubmit}>
                  <h2 class="title">Sign in</h2>
                  <div class="input-field">
                    <i class="fas fa-user"></i>
                    <FormInput
                      type="text"
                      placeholder="Username"
                      name="username"
                      value={values.username}
                      autoComplete="off"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.username && errors.username}
                      errorMessage={errors.username && errors.username}
                    />
                  </div>
                  <div class="input-field">
                    <i class="fas fa-lock"></i>
                    <FormInput
                      type="password"
                      placeholder="Password"
                      name="password"
                      value={values.password}
                      autoComplete="off"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      hasError={touched.password && errors.password}
                      errorMessage={errors.password && errors.password}
                    />
                  </div>
                  <input type="submit" value="Login" class="btn solid" />
                  <p>{status}</p>
                </form>
              )}
            </Formik>
          </div>
        </div>

        <div class="panels-container">
          <div class="panel left-panel">
            <div class="content">
              <h3>Welcome !</h3>
              <p>You must login to view entire pages</p>
            </div>
            <img
              src="./Sliding-Sign-In-Sign-Up-Form-master/img/log.svg"
              class="image"
              alt=""
            />
          </div>
        </div>
      </div>

      <script src="./Sliding-Sign-In-Sign-Up-Form-master/app.js"></script>
    </div>
  );
};
export default Login;
