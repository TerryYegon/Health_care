// src/pages/SignIn.jsx
import React from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useNavigate } from "react-router-dom";
import { authAPI } from "../api";
import { useAuth } from "../context/AuthContext"; // matches your imports elsewhere
import "./SignIn.css"; // optional: create styles or reuse existing

const SignIn = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const initialValues = { email: "", password: "" };

  const ValidationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email").required("Email is required"),
    password: Yup.string().min(6, "Minimum 6 characters").required("Password is required"),
  });

  const handleSetUserInContext = (userObj) => {
    // Defensive: try common ways AuthContext may accept a user
    if (auth && typeof auth.setUser === "function") {
      auth.setUser(userObj);
    } else if (auth && typeof auth.login === "function") {
      // some contexts expose login(user)
      auth.login(userObj);
    } else if (auth && typeof auth.dispatch === "function") {
      // Redux-like context
      auth.dispatch({ type: "LOGIN", payload: userObj });
    } else {
      // fallback so app has a user available (temp)
      localStorage.setItem("user", JSON.stringify(userObj));
    }
  };

  return (
    <div className="signin-page">
      <h2>Sign In</h2>

      <Formik
        initialValues={initialValues}
        validationSchema={ValidationSchema}
        onSubmit={async (values, { setSubmitting, setStatus }) => {
          setStatus(null);
          setSubmitting(true);
          try {
            const user = await authAPI.login(values);
            handleSetUserInContext(user);
            setSubmitting(false);
            navigate("/dashboard", { replace: true });
          } catch (err) {
            setStatus(err.message || "Login failed");
            setSubmitting(false);
          }
        }}
      >
        {({ isSubmitting, status }) => (
          <Form className="signin-form">
            {status && <div className="error-message">{status}</div>}

            <label>
              Email
              <Field type="email" name="email" />
              <ErrorMessage name="email" component="div" className="field-error" />
            </label>

            <label>
              Password
              <Field type="password" name="password" />
              <ErrorMessage name="password" component="div" className="field-error" />
            </label>

            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? "Signing in..." : "Sign In"}
            </button>

            {/* optional handy demo buttons for quick testing */}
            <div style={{ marginTop: 12 }}>
              <small>Quick demo logins:</small>
              <div style={{ display: "flex", gap: 8, marginTop: 8 }}>
                <button
                  type="button"
                  onClick={() => {
                    // demo: autofill and submit via authAPI, then redirect
                    (async () => {
                      try {
                        const demoUser = await authAPI.login({ email: "patient@example.com" });
                        handleSetUserInContext(demoUser);
                        navigate("/dashboard", { replace: true });
                      } catch (e) {
                        // ignore
                      }
                    })();
                  }}
                >
                  Demo Patient
                </button>

                <button
                  type="button"
                  onClick={() => {
                    (async () => {
                      try {
                        const demoUser = await authAPI.login({ email: "doctor@example.com" });
                        handleSetUserInContext(demoUser);
                        navigate("/dashboard", { replace: true });
                      } catch (e) {}
                    })();
                  }}
                >
                  Demo Doctor
                </button>

                <button
                  type="button"
                  onClick={() => {
                    (async () => {
                      try {
                        const demoUser = await authAPI.login({ email: "admin@example.com" });
                        handleSetUserInContext(demoUser);
                        navigate("/dashboard", { replace: true });
                      } catch (e) {}
                    })();
                  }}
                >
                  Demo Admin
                </button>
              </div>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
};

export default SignIn;
