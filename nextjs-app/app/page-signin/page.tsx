"use client"
import Layout from "@/components/Layout/Layout";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import React, { useState } from "react";
import { useAuthStore } from "@/stores/useAuthorStore";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

const schema = yup.object().shape({
  username: yup.string().required("Username or Email is required"),
  password: yup.string().required("Password is required"),
});

export default function Signin() {
  const [loginError, setLoginError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });
  const router = useRouter();
  const onSubmit = async (data: any) => {
    setLoginError("");
    try {
      const res = await fetch("http://localhost:8080/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: data.username,
          password: data.password,
        }),
      });
      if (res.ok) {
        const result = await res.json();
        useAuthStore.getState().setAuth(result.username, result.accessToken);
        toast.success("Đăng nhập thành công!");
        setTimeout(() => {
          router.push("/");
        }, 1200);
      } else {
        toast.error("Đăng nhập thất bại!");
        setLoginError("Login failed!");
      }
    } catch (err: any) {
      toast.error("Login error!");
      setLoginError("Login error!");
    }
  };



  return (
    <>
      <Layout>
        <section className="pt-100 login-register">
          <div className="container">
            <div className="row login-register-cover">
              <div className="col-lg-4 col-md-6 col-sm-12 mx-auto">
                <div className="text-center">
                  <p className="font-sm text-brand-2">Welcome back! </p>
                  <h2 className="mt-10 mb-5 text-brand-1">Member Login</h2>
                  <p className="font-sm text-muted mb-30">Access to all features. No credit card required.</p>
                  <button className="btn social-login hover-up mb-20" type="button">
                    <img src="assets/imgs/template/icons/icon-google.svg" alt="jobbox" />
                    <strong>Sign in with Google</strong>
                  </button>
                  <div className="divider-text-center">
                    <span>Or continue with</span>
                  </div>
                </div>
                <form className="login-register text-start mt-20" onSubmit={handleSubmit(onSubmit)}>
                  {loginError && <div className="alert alert-danger">{loginError}</div>}
                  <div className="form-group">
                    <label className="form-label" htmlFor="input-1">
                      Username or Email address *
                    </label>
                    <input
                      className="form-control"
                      id="input-1"
                      type="text"
                      {...register("username")}
                      placeholder="Steven Job"
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
                  <div className="login_footer form-group d-flex justify-content-between">
                    <label className="cb-container">
                      <input type="checkbox" />
                      <span className="text-small">Remember me</span>
                      <span className="checkmark" />
                    </label>
                    <Link href="/page-contact">
                      <span className="text-muted">Forgot Password</span>
                    </Link>
                  </div>
                  <div className="form-group">
                    <button className="btn btn-brand-1 hover-up w-100" type="submit" name="login">
                      Login
                    </button>
                  </div>
                  <div className="text-muted text-center">
                    Don't have an Account?
                    <Link href="/page-signin">
                      <span>Sign up</span>
                    </Link>
                  </div>
                </form>
              </div>
              <div className="img-1 d-none d-lg-block">
                <img className="shape-1" src="assets/imgs/page/login-register/img-4.svg" alt="JobBox" />
              </div>
              <div className="img-2">
                <img src="assets/imgs/page/login-register/img-3.svg" alt="JobBox" />
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </>
  );
}
