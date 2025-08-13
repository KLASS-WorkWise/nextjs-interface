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
              {/* ...existing nav code... */}
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