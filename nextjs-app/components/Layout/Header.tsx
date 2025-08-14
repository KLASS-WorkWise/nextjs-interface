/* eslint-disable @next/next/no-html-link-for-pages */
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  handleOpen: () => void;
  handleRemove: () => void;
  openClass: string;
}

const Header = ({ handleOpen, handleRemove, openClass }: HeaderProps) => {
  const [scroll, setScroll] = useState(false);
  const { data: session } = useSession();

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  });

  return (
    <>
      <header className={scroll ? "header sticky-bar stick" : "header sticky-bar"}>
        <div className="container">
          <div className="main-header">
            <div className="header-left">
              <div className="header-logo">
                <Link href="/">
                  <span className="d-flex">
                    <img alt="jobBox" src="assets/imgs/template/jobhub-logo.svg" />
                  </span>
                </Link>
              </div>
            </div>
            <div className="header-nav">
              <nav className="nav-main-menu">
                <ul className="main-menu">
                  <li>
                    <Link href="/">
                      <span>Home</span>
                    </Link>
                  </li>
                  <li className="has-children">
                    <Link href="/jobs-grid">
                      <span>Find a Job</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link href="/jobs-grid">
                          <span>Jobs Grid</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/job-details-2">
                          <span>Jobs Details</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/companies-grid">
                      <span>Recruiters</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link href="/companies-grid">
                          <span>Recruiters</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/company-details">
                          <span>Company Details</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/candidates-grid">
                      <span>Candidates</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link href="/candidates-grid">
                          <span>Candidates Grid</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/candidate-details">
                          <span>Candidate Details</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/candidate-profile">
                          <span>Candidate Profile</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/blog-grid">
                      <span>Pages</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link href="/page-about">
                          <span>About Us</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/page-reset-password">
                          <span>Reset Password</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/blog-grid">
                      <span>Blog</span>
                    </Link>
                    <ul className="sub-menu">
                      <li>
                        <Link href="/blog-grid-2">
                          <span>Blog Grid</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="/blog-details">
                          <span>Blog Single</span>
                        </Link>
                      </li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/page-contact">
                      <span>Contact</span>
                    </Link>
                  </li>
                </ul>
              </nav>
            </div>
            <div className="header-right">
              <div className="block-signin">
                {session?.user ? (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "#eee",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontWeight: "bold",
                        fontSize: 18,
                        color: "#333",
                      }}
                    >
                      {session.user.fullName
                        ? session.user.fullName[0].toUpperCase()
                        : session.user.username
                          ? session.user.username[0].toUpperCase()
                          : session.user.email
                            ? session.user.email[0].toUpperCase()
                            : "U"}
                    </div>
                    <span>
                      Hi, {session.user.fullName || session.user.username || session.user.email}
                    </span>
                    <button
                      className="btn btn-default btn-shadow ml-20 hover-up"
                      onClick={() => signOut()}
                      style={{ marginLeft: 10 }}
                    >
                      Logout
                    </button>
                  </div>
                ) : (
                  <>
                    <Link href="/page-register">
                      <span className="text-link-bd-btom hover-up">Register</span>
                    </Link>
                    <Link href="/page-signin">
                      <span className="btn btn-default btn-shadow ml-40 hover-up">Sign in</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
      {/* ...existing mobile header code... */}
    </>
  );
};

export default Header;