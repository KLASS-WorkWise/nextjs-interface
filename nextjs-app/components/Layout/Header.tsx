import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useSession, signOut } from "next-auth/react";

interface HeaderProps {
  handleOpen: () => void;
  handleRemove: () => void;
  openClass: string;
}

const Header = ({ handleOpen, handleRemove, openClass }: HeaderProps) => {
  const [scroll, setScroll] = useState(false);
  const { data: session } = useSession();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.addEventListener("scroll", () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
  }, [scroll]);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownOpen]);

  return (
    <>
      <header className={scroll ? "header sticky-bar stick" : "header sticky-bar"}>
        <div className="container">
          <div className="main-header">
            {/* Logo */}
            <div className="header-left">
              <div className="header-logo">
                <Link href="/">
                  <span className="d-flex">
                    <img alt="jobBox" src="assets/imgs/template/jobhub-logo.svg" />
                  </span>
                </Link>
              </div>
            </div>

            {/* Menu */}
            <div className="header-nav">
              <nav className="nav-main-menu">
                <ul className="main-menu">
                  <li>
                    <Link href="/"><span>Home</span></Link>
                  </li>
                  <li className="has-children">
                    <Link href="/jobs-grid"><span>Find a Job</span></Link>
                    <ul className="sub-menu">
                      <li><Link href="/jobs-grid"><span>Jobs Grid</span></Link></li>
                      <li><Link href="/job-details-2"><span>Jobs Details</span></Link></li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/companies-grid"><span>Recruiters</span></Link>
                    <ul className="sub-menu">
                      <li><Link href="/companies-grid"><span>Recruiters</span></Link></li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/candidates-grid"><span>Candidates</span></Link>
                    <ul className="sub-menu">
                      <li><Link href="/candidates-grid"><span>Candidates Grid</span></Link></li>
                      <li><Link href="/candidate-profile"><span>Candidate Profile</span></Link></li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/blog-grid"><span>Pages</span></Link>
                    <ul className="sub-menu">
                      <li><Link href="/page-about"><span>About Us</span></Link></li>
                    </ul>
                  </li>
                  <li className="has-children">
                    <Link href="/blog-grid"><span>Blog</span></Link>
                    <ul className="sub-menu">
                      <li><Link href="/blog-grid-2"><span>Blog Grid</span></Link></li>
                      <li><Link href="/blog-details"><span>Blog Single</span></Link></li>
                    </ul>
                  </li>
                  <li>
                    <Link href="/page-contact"><span>Contact</span></Link>
                  </li>
                </ul>
              </nav>
            </div>

            {/* Right side */}
            <div className="header-right">
              <div className="block-signin">
                {session?.user ? (
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "9px",
                      position: "relative",
                    }}
                    ref={dropdownRef}
                  >
                    {/* Avatar user */}
                    <img
                      src="/assets/imgs/avatar/logoLogin.jpg"
                      alt="Avatar"
                      style={{
                        width: 50,
                        height: 50,
                        borderRadius: "50%",
                        objectFit: "cover",
                        cursor: "pointer",
                        background: "#eee",
                        border: "2px solid #e0e0e0",
                      }}
                      onClick={() => setDropdownOpen((v) => !v)}
                    />

                    {/* Nút Đăng tuyển ngay kiểu mới */}
                    <Link
                      href="/recruiter/register"
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 8,
                        textDecoration: "none",
                        background: "transparent",
                        padding: "4px 8px",
                      }}
                    >
                      <div style={{ lineHeight: 1.2 }}>
                        <div style={{ fontSize: 13, color: "#888" }}>
                          Bạn là nhà tuyển dụng?
                        </div>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: "blue",
                          }}
                        >
                          Đăng tuyển ngay »
                        </div>
                      </div>
                    </Link>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                      <div
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "110%",
                          minWidth: 360,
                          background: "#fff",
                          boxShadow: "0 4px 24px rgba(0,0,0,0.12)",
                          borderRadius: 12,
                          zIndex: 100,
                          padding: 24,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            marginBottom: 18,
                          }}
                        >
                          <img
                            src="/assets/imgs/avatar/logoLogin.jpg"
                            alt="Avatar"
                            style={{
                              width: 56,
                              height: 56,
                              borderRadius: "50%",
                              objectFit: "cover",
                              background: "#eee",
                              border: "2px solid #e0e0e0",
                            }}
                          />
                          <div>
                            <div
                              style={{
                                fontWeight: 600,
                                fontSize: 17,
                                marginBottom: 2,
                              }}
                            >
                              {session.user.fullName ||
                                session.user.username ||
                                session.user.email}
                            </div>
                            <div style={{ fontSize: 14, color: "#888" }}>
                              {session.user.email}
                            </div>
                          </div>
                        </div>
                        <div
                          style={{
                            borderTop: "1px solid #f0f0f0",
                            marginBottom: 12,
                          }}
                        />
                        <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                          <li>
                            <Link href="/">
                              <span
                                style={{
                                  display: "block",
                                  padding: "8px 0",
                                  color: "#333",
                                  fontWeight: 500,
                                }}
                              >
                                Quản lý tài khoản
                              </span>
                            </Link>
                          </li>
                          <li>
                            <Link href="/page-reset-password">
                              <span
                                style={{
                                  display: "block",
                                  padding: "8px 0",
                                  color: "#333",
                                  fontWeight: 500,
                                }}
                              >
                                Reset Password
                              </span>
                            </Link>
                          </li>
                        </ul>
                        <button
                          className="btn btn-primary w-100 mt-3"
                          style={{ marginTop: 18, fontWeight: 500 }}
                          onClick={() => signOut()}
                        >
                          Đăng xuất
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="/page-register">
                      <span className="text-link-bd-btom hover-up">Register</span>
                    </Link>
                    <Link href="/page-signin">
                      <span className="btn btn-default btn-shadow ml-40 hover-up">
                        Sign in
                      </span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
