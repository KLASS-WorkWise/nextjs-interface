"use client";
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";

const schema = yup.object().shape({
  fullname: yup.string().required("Full Name is required"),
  emailaddress: yup.string().email("Invalid email").required("Email is required"),
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
  repassword: yup
    .string()
    .oneOf([yup.ref("password")], "Passwords do not match")
    .required("Please re-enter your password"),
});

export default function Register() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: any) => {
    setError("");
    setSuccess("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8080/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
          email: data.emailaddress,
          fullname: data.fullname,
        }),
      });
      if (!res.ok) {
        const resData = await res.json();
        throw new Error(resData.message || "Registration failed");
      }
      setSuccess("Register successful! Please login.");
      reset();
    } catch (err: any) {
      setError(err.message || "Registration error");
    }
    setLoading(false);
  };

  return (
    <>
      <Layout>
        <section className="pt-100 login-register">
          <div className="container">
            <div className="row login-register-cover">
              <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
                <div className="text-center">
                  <p className="font-sm text-brand-2">Register </p>
                  <h2 className="mt-10 mb-5 text-brand-1">Start for free Today</h2>
                  <p className="font-sm text-muted mb-30">Access to all features. No credit card required.</p>
                  <button className="btn social-login hover-up mb-20" type="button" disabled>
                    <img src="assets/imgs/template/icons/icon-google.svg" alt="jobbox" />
                    <strong>Sign up with Google</strong>
                  </button>
                  <div className="divider-text-center">
                    <span>Or continue with</span>
                  </div>
                </div>
                <form className="login-register text-start mt-20" onSubmit={handleSubmit(onSubmit)}>
                  {error && <div className="alert alert-danger">{error}</div>}
                  {success && <div className="alert alert-success">{success}</div>}
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-1">
                      Full Name *
                    </label>
                    <input
                      className="form-control"
                      id="input-1"
                      type="text"
                      {...register("fullname")}
                      placeholder="Steven Job"
                    />
                    {errors.fullname && (
                      <span className="text-danger font-xs">{errors.fullname.message as string}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-2">
                      Email *
                    </label>
                    <input
                      className="form-control"
                      id="input-2"
                      type="email"
                      {...register("emailaddress")}
                      placeholder="stevenjob@gmail.com"
                    />
                    {errors.emailaddress && (
                      <span className="text-danger font-xs">{errors.emailaddress.message as string}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-3">
                      Username *
                    </label>
                    <input
                      className="form-control"
                      id="input-3"
                      type="text"
                      {...register("username")}
                      placeholder="stevenjob"
                    />
                    {errors.username && (
                      <span className="text-danger font-xs">{errors.username.message as string}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-4">
                      Password *
                    </label>
                    <input
                      className="form-control"
                      id="input-4"
                      type="password"
                      {...register("password")}
                      placeholder="************"
                    />
                    {errors.password && (
                      <span className="text-danger font-xs">{errors.password.message as string}</span>
                    )}
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-5">
                      Re-Password *
                    </label>
                    <input
                      className="form-control"
                      id="input-5"
                      type="password"
                      {...register("repassword")}
                      placeholder="************"
                    />
                    {errors.repassword && (
                      <span className="text-danger font-xs">{errors.repassword.message as string}</span>
                    )}
                  </div>
                  <div className="login_footer form-group d-flex justify-content-between">
                    <label className="cb-container">
                      <input type="checkbox" required />
                      <span className="text-small">Agree our terms and policy</span>
                      <span className="checkmark" />
                    </label>
                    <Link href="/page-contact">
                      <span className="text-muted">Lean more</span>
                    </Link>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-brand-1 hover-up w-100" type="submit" name="login" disabled={loading}>
                      {loading ? "Registering..." : "Submit & Register"}
                    </button>
                  </div>
                  <div className="text-muted text-center">
                    Already have an account?
                    <Link href="/page-signin">
                      <span>Sign in</span>
                    </Link>
                  </div>
                </form>
              </div>
              <div className="img-1 d-none d-lg-block">
                <img className="shape-1" src="assets/imgs/page/login-register/img-1.svg" alt="JobBox" />
              </div>
              <div className="img-2">
                <img src="assets/imgs/page/login-register/img-2.svg" alt="JobBox" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}