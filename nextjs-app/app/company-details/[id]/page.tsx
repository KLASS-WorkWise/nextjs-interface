"use client";
/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "@/components/Layout/Layout";

import React, { useState } from "react";
import { useParams } from "next/navigation";

type Company = {
  bannerUrl?: string;
  logoUrl?: string;
  companyName?: string;
  location?: string;
  industry?: string;
  description?: string;
  address?: string;
  website?: string;
  phone?: string;
  email?: string;
  // Add other properties as needed
};

export default function CompanyDetails() {
  const params = useParams();
  const [activeIndex, setActiveIndex] = useState<number>(1);
  const companyId = params?.id as string; // id lấy từ URL

  const [company, setCompany] = useState<Company | null>(null);

  React.useEffect(() => {
    async function fetchCompany() {
      try {
        // Gọi API với id lấy từ URL
        const data = await import("@/lib/company/api").then(m => m.getCompanyById(companyId));
        setCompany(data);
      } catch (err) {
        setCompany(null);
      }
    }
    if (companyId) fetchCompany();
  }, [companyId]);


  const handleOnClick = (index: number) => {
    setActiveIndex(index);
  };

  return (
    <>
      <Layout>
        <div>
          <section className="section-box-2">
            <div className="container">
              <div className="banner-hero banner-image-single">
                <img src={company?.bannerUrl || "assets/imgs/page/company/img.png"} 
                alt={company?.companyName || "jobBox"}
                 style={{
                  width: "100%",         // banner chiếm full chiều ngang
                  height: "250px",       // chiều cao mặc định
                  objectFit: "cover",    // ảnh không bị méo, tự cắt cho vừa
                  borderRadius: "8px"    // bo góc nhẹ
                }} />
              </div>
              <div className="box-company-profile">
                <div className="image-compay">
                  <img src={company?.logoUrl || "assets/imgs/page/company/company.png"} 
                  alt={company?.companyName || "jobBox"} 
                  style={{
                  width: "100px",       // logo mặc định 100px
                  height: "100px",
                  objectFit: "contain", // giữ tỉ lệ logo
                  borderRadius: "8px",  // bo góc nhẹ
                  background: "#fff",   // nền trắng
                  padding: "5px"        // khoảng cách bên trong
                }}
                 />
                </div>
                <div className="row mt-10">
                  <div className="col-lg-8 col-md-12">
                    <h5 className="f-18">
                      {company?.companyName || "Company name"} <span className="card-location font-regular ml-20">{company?.location || "Location"}</span>
                    </h5>
                    <p className="mt-5 font-md color-text-paragraph-2 mb-15">{company?.industry || "Our Mission to make working life simple"}</p>
                  </div>
                  <div className="col-lg-4 col-md-12 text-lg-end">
                    <Link href="page-contact">
                      <span className="btn btn-call-icon btn-apply btn-apply-big">Contact us</span>
                    </Link>
                  </div>
                </div>
              </div>
              <div className="box-nav-tabs mt-40 mb-5">
                <ul className="nav" role="tablist">
                  <li>
                    <a className={`btn btn-border aboutus-icon mr-15 mb-5${activeIndex === 1 ? " active" : ""}`} onClick={() => handleOnClick(1)}>
                      About us
                    </a>
                  </li>
                  <li>
                    <a className={`btn btn-border recruitment-icon mr-15 mb-5${activeIndex === 2 ? " active" : ""}`} onClick={() => handleOnClick(2)}>
                      Recruitments
                    </a>
                  </li>
                  <li>
                    <a className={`btn btn-border people-icon mb-5${activeIndex === 3 ? " active" : ""}`} onClick={() => handleOnClick(3)}>
                      People
                    </a>
                  </li>
                </ul>
              </div>
              <div className="border-bottom pt-10 pb-10" />
            </div>
          </section>
          <section className="section-box mt-50">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                  <div className="content-single">
                    <div className="tab-content">
                      <div className={`tab-pane fade ${activeIndex === 1 && "show active"}`}>
                        <h4>Welcome to {company?.companyName}</h4>
                        <p>{company?.description || "Our Mission to make working life simple"}</p>
                      </div>
                      <div className={`tab-pane fade ${activeIndex === 2 && "show active"}`}>
                        <h4>Recruitments</h4>
                        <p>The {company?.companyName} Design team has a vision to establish a trusted platform that enables productive and healthy enterprises in a world of digital and remote everything, constantly changing work patterns and norms, and the need for organizational resiliency.</p>
                        <p>The ideal candidate will have strong creative skills and a portfolio of work which demonstrates their passion for illustrative design and typography. This candidate will have experiences in working with numerous different design platforms such as digital and print forms.</p>
                      </div>
                      <div className={`tab-pane fade ${activeIndex === 3 && "show active"}`}>
                        <h4>People</h4>
                        <p>The AliStudio Design team has a vision to establish a trusted platform that enables productive and healthy enterprises in a world of digital and remote everything, constantly changing work patterns and norms, and the need for organizational resiliency.</p>
                        <p>The ideal candidate will have strong creative skills and a portfolio of work which demonstrates their passion for illustrative design and typography. This candidate will have experiences in working with numerous different design platforms such as digital and print forms.</p>
                      </div>
                    </div>
                  </div>
                  <div className="box-related-job content-page">
                    <h5 className="mb-30">Latest Jobs</h5>
                    <div className="box-list-jobs display-list">
                      <div className="col-xl-12 col-12">
                        <div className="card-grid-2 hover-up">
                          <span className="flash" />
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="card-grid-2-image-left">
                                <div className="image-box">
                                  <img src="/assets/imgs/brands/brand-6.png" alt="jobBox" />
                                </div>
                                <div className="right-info">
                                  <Link href="#">
                                    <span className="name-job">Quora JSC</span>
                                  </Link>
                                  <span className="location-small">New York, US</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 text-start text-md-end pr-60 col-md-6 col-sm-12">
                              <div className="pl-15 mb-15 mt-30">
                                <Link href="#">
                                  <span className="btn btn-grey-small mr-5">Adobe XD</span>
                                </Link>

                                <Link href="#">
                                  <span className="btn btn-grey-small mr-5">Figma</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="card-block-info">
                            <h4>
                              <Link href="job-details">
                                <span>Senior System Engineer</span>
                              </Link>
                            </h4>
                            <div className="mt-5">
                              <span className="card-briefcase">Part time</span>
                              <span className="card-time">
                                <span>5</span>
                                <span> mins ago</span>
                              </span>
                            </div>
                            <p className="font-sm color-text-paragraph mt-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                            <div className="card-2-bottom mt-20">
                              <div className="row">
                                <div className="col-lg-7 col-7">
                                  <span className="card-text-price">$800</span>
                                  <span className="text-muted">/Hour</span>
                                </div>
                                <div className="col-lg-5 col-5 text-end">
                                  <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                                    Apply now
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-12">
                        <div className="card-grid-2 hover-up">
                          <span className="flash" />
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="card-grid-2-image-left">
                                <div className="image-box">
                                  <img src="/assets/imgs/brands/brand-5.png" alt="jobBox" />
                                </div>
                                <div className="right-info">
                                  <Link href="#">
                                    <span className="name-job">Nintendo</span>
                                  </Link>
                                  <span className="location-small">New York, US</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 text-start text-md-end pr-60 col-md-6 col-sm-12">
                              <div className="pl-15 mb-15 mt-30">
                                <Link href="#">
                                  <span className="btn btn-grey-small mr-5">Adobe XD</span>
                                </Link>

                                <Link href="#">
                                  <span className="btn btn-grey-small mr-5">Figma</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="card-block-info">
                            <h4>
                              <Link href="job-details">
                                <span>Products Manager</span>
                              </Link>
                            </h4>
                            <div className="mt-5">
                              <span className="card-briefcase">Full time</span>
                              <span className="card-time">
                                <span>6</span>
                                <span> mins ago</span>
                              </span>
                            </div>
                            <p className="font-sm color-text-paragraph mt-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                            <div className="card-2-bottom mt-20">
                              <div className="row">
                                <div className="col-lg-7 col-7">
                                  <span className="card-text-price">$250</span>
                                  <span className="text-muted">/Hour</span>
                                </div>
                                <div className="col-lg-5 col-5 text-end">
                                  <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                                    Apply now
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="col-xl-12 col-12">
                        <div className="card-grid-2 hover-up">
                          <span className="flash" />
                          <div className="row">
                            <div className="col-lg-6 col-md-6 col-sm-12">
                              <div className="card-grid-2-image-left">
                                <div className="image-box">
                                  <img src="/assets/imgs/brands/brand-8.png" alt="jobBox" />
                                </div>
                                <div className="right-info">
                                  <Link href="#">
                                    <span className="name-job">Periscope</span>
                                  </Link>
                                  <span className="location-small">New York, US</span>
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-6 text-start text-md-end pr-60 col-md-6 col-sm-12">
                              <div className="pl-15 mb-15 mt-30">
                                <Link href="#">
                                  <span className="btn btn-grey-small mr-5">Adobe XD</span>
                                </Link>

                                <Link href="#">
                                  <span className="btn btn-grey-small mr-5">Figma</span>
                                </Link>
                              </div>
                            </div>
                          </div>
                          <div className="card-block-info">
                            <h4>
                              <Link href="job-details">
                                <span>Lead Quality Control QA</span>
                              </Link>
                            </h4>
                            <div className="mt-5">
                              <span className="card-briefcase">Full time</span>
                              <span className="card-time">
                                <span>6</span>
                                <span> mins ago</span>
                              </span>
                            </div>
                            <p className="font-sm color-text-paragraph mt-10">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto eveniet, dolor quo repellendus pariatur.</p>
                            <div className="card-2-bottom mt-20">
                              <div className="row">
                                <div className="col-lg-7 col-7">
                                  <span className="card-text-price">$250</span>
                                  <span className="text-muted">/Hour</span>
                                </div>
                                <div className="col-lg-5 col-5 text-end">
                                  <div className="btn btn-apply-now" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                                    Apply now
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="paginations">
                      <ul className="pager">
                        <li>
                          <a className="pager-prev" href="#" />
                        </li>
                        <li>
                          <Link href="#">
                            <span className="pager-number">1</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="pager-number">2</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="pager-number">3</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="pager-number">4</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="pager-number">5</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="pager-number active">6</span>
                          </Link>
                        </li>
                        <li>
                          <Link href="#">
                            <span className="pager-number">7</span>
                          </Link>
                        </li>
                        <li>
                          <a className="pager-next" href="#" />
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
                  <div className="sidebar-border">
                    <div className="sidebar-heading">
                      <div className="avatar-sidebar">
                        <div className="sidebar-info pl-0">
                          <span className="sidebar-company">{company?.companyName}</span>
                          <span className="card-location">{company?.location}</span>
                        </div>
                      </div>
                    </div>
                    <div className="sidebar-list-job">
                      {/* <div className="box-map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.3150609575905!2d-87.6235655!3d41.886080899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca8b34afe61%3A0x6caeb5f721ca846!2s205%20N%20Michigan%20Ave%20Suit%20810%2C%20Chicago%2C%20IL%2060601%2C%20Hoa%20K%E1%BB%B3!5e0!3m2!1svi!2s!4v1658551322537!5m2!1svi!2s" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                      </div> */}
                      <div className="box-map">
                        <iframe
                          src={`https://www.google.com/maps?q=${encodeURIComponent(
                            `${company?.address || ""} ${company?.location || ""}`
                          )}&output=embed`}
                          allowFullScreen
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                          style={{ width: "100%", height: "200px", border: 0, borderRadius: "8px" }}
                        />
                      </div>
                    </div>
                    <div className="sidebar-list-job">
                      <ul>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-briefcase" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">Company field</span>
                            <strong className="small-heading">{company?.industry}</strong>
                          </div>
                        </li>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-marker" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">Location</span>
                            <strong className="small-heading">{company?.address}</strong>
                          </div>
                        </li>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-dollar" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">website</span>
                            <strong className="small-heading">{company?.website}</strong>
                          </div>
                        </li>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-clock" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">Member since</span>
                            <strong className="small-heading">Jul 2012</strong>
                          </div>
                        </li>
                        <li>
                          <div className="sidebar-icon-item">
                            <i className="fi-rr-time-fast" />
                          </div>
                          <div className="sidebar-text-info">
                            <span className="text-description">Last Jobs Posted</span>
                            <strong className="small-heading">4 days</strong>
                          </div>
                        </li>
                      </ul>
                    </div>
                    <div className="sidebar-list-job">
                      <ul className="ul-disc">
                        <li>Address: {company?.address}, {company?.location}</li>
                        <li>Phone: {company?.phone}</li>
                        <li>Email: {company?.email}</li>
                      </ul>
                      <div className="mt-30">
                        <Link href="page-contact">
                          <span className="btn btn-send-message">Send Message</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="sidebar-border-bg bg-right">
                    <span className="text-grey">WE ARE</span>
                    <span className="text-hiring">HIRING</span>
                    <p className="font-xxs color-text-paragraph mt-5">Lorem ipsum dolor sit amet, consectetur adipisicing elit. Recusandae architecto</p>
                    <div className="mt-15">
                      <Link href="page-contact">
                        <span className="btn btn-paragraph-2">Know More</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-20">
            <div className="container">
              <div className="box-newsletter">
                <div className="row">
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="assets/imgs/template/newsletter-left.png" alt="joxBox" />
                  </div>
                  <div className="col-lg-12 col-xl-6 col-12">
                    <h2 className="text-md-newsletter text-center">
                      New Things Will Always
                      <br /> Update Regularly
                    </h2>
                    <div className="box-form-newsletter mt-40">
                      <form className="form-newsletter">
                        <input className="input-newsletter" type="text" placeholder="Enter your email here" />
                        <button className="btn btn-default font-heading icon-send-letter">Subscribe</button>
                      </form>
                    </div>
                  </div>
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="assets/imgs/template/newsletter-right.png" alt="joxBox" />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
    </>
  );
}
