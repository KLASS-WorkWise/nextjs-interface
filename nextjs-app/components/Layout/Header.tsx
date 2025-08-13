import Link from "next/link";
import React, { useState, useEffect, useRef } from "react";
import { useAuthStore } from "@/stores/useAuthorStore";

interface HeaderProps {
  handleOpen: () => void;
  handleRemove: () => void;
  openClass: string;
}

const Header = ({ handleOpen, handleRemove, openClass }: HeaderProps) => {
  const [scroll, setScroll] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const username = useAuthStore((state: any) => state.username);
  const logout = useAuthStore((state: any) => state.logout);

  const avatarRef = useRef<HTMLDivElement | null>(null);
  const hideTimeout = useRef<number | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      setScroll(window.scrollY > 100);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const closeDropdownDelayed = (delay = 300) => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
    }
    hideTimeout.current = window.setTimeout(() => {
      setShowDropdown(false);
      hideTimeout.current = null;
    }, delay);
  };

  const openDropdownImmediately = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setShowDropdown(true);
  };

  const toggleDropdown = () => {
    if (hideTimeout.current) {
      clearTimeout(hideTimeout.current);
      hideTimeout.current = null;
    }
    setShowDropdown((s) => !s);
  };

  useEffect(() => {
    const handleDocMouseDown = (e: MouseEvent) => {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleDocMouseDown);
    return () => {
      document.removeEventListener("mousedown", handleDocMouseDown);
    };
  }, []);

  useEffect(() => {
    return () => {
      if (hideTimeout.current) {
        clearTimeout(hideTimeout.current);
      }
    };
  }, []);

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
                          <span>Jobs Details  </span>
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
                      <span>About Us</span>
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

              <div
                className={`burger-icon burger-icon-white ${openClass && "burger-close"}`}
                onClick={() => {
                  handleOpen();
                  handleRemove();
                }}
              >
                <span className="burger-icon-top" />
                <span className="burger-icon-mid" />
                <span className="burger-icon-bottom" />
              </div>
            </div>

            <div className="header-right">
              <div className="block-signin">
                {username ? (
                  <div
                    ref={avatarRef}
                    style={{
                      position: "relative",
                      display: "flex",
                      alignItems: "center",
                      gap: 8,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onMouseEnter={openDropdownImmediately}
                    onMouseLeave={() => closeDropdownDelayed(200)}
                    onClick={toggleDropdown}
                  >
                    <img
                      src="imgs/brands/brand-3.png"
                      alt="avatar"
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: "50%",
                        background: "#eee",
                        flexShrink: 0,
                      }}
                    />
                    <span style={{ fontWeight: 500, color: "red" }}>Hi, {username}</span>

                    {showDropdown && (
                      <div
                        style={{
                          position: "absolute",
                          top: "calc(100% + 6px)",
                          right: 0,
                          background: "#fff",
                          color: "#333",
                          borderRadius: 6,
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                          minWidth: 160,
                          zIndex: 100,
                        }}
                        onMouseEnter={openDropdownImmediately}
                        onMouseLeave={() => closeDropdownDelayed(200)}
                      >
                        <Link href="/profile">
                          <div
                            style={{
                              padding: "10px 16px",
                              cursor: "pointer",
                              borderBottom: "1px solid #eee",
                              whiteSpace: "nowrap",
                            }}
                          >
                            Tài Khoản Của Tôi
                          </div>
                        </Link>
                        <div
                          style={{
                            padding: "10px 16px",
                            cursor: "pointer",
                            color: "#ee4d2d",
                            whiteSpace: "nowrap",
                          }}
                          onClick={() => {
                            setShowDropdown(false);
                            logout();
                          }}
                        >
                          Đăng Xuất
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <>
                    <Link href="page-register">
                      <span className="text-link-bd-btom hover-up">Register</span>
                    </Link>
                    <Link href="page-signin">
                      <span className="btn btn-default btn-shadow ml-40 hover-up">Sign in</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile header giữ nguyên */}
      <div className="mobile-header-active mobile-header-wrapper-style perfect-scrollbar">
        <div className="mobile-header-wrapper-inner">
          <div className="mobile-header-content-area">
            {/* ... mobile menu code ... */}
          </div>
        </div>
      </div>
    </>
  );
};

export default Header;