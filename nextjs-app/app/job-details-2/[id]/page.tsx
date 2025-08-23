"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
/* eslint-disable react/no-unescaped-entities */
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import FeaturedSlider from "@/components/sliders/Featured";

export default function JobDetails2() {
  const { id } = useParams();
  const [job, setJob] = useState<any>(null);
  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:8080/api/job-postings/${id}`)
      .then((res) => res.json())
      .then((data) => setJob(data))
      .catch(() => setJob(null));
  }, [id]);
  return (
    <>
      <Layout>
        <div>
          <section className="section-box mt-50">
            <div className="container">
              <div className="row">
                <div className="col-lg-8 col-md-12 col-sm-12 col-12">
                  <div className="box-border-single">
                    {/* JOB DETAIL: DỮ LIỆU TỪ API */}
                    {!job ? (
                      <div>Loading...</div>
                    ) : (
                      <>
                        <div className="row mt-10">
                          <div className="col-lg-8 col-md-12">
                            <h3>{job.title}</h3>
                            <div className="mt-0 mb-15">
                              {job.jobType && <span className="card-briefcase">{job.jobType}</span>}
                              {job.createdAt && <span className="card-time">{new Date(job.createdAt).toLocaleDateString()}</span>}
                            </div>
                          </div>
                          <div className="col-lg-4 col-md-12 text-lg-end">
                            <div className="btn btn-apply-icon btn-apply btn-apply-big hover-up" data-bs-toggle="modal" data-bs-target="#ModalApplyJobForm">
                              Apply now
                            </div>
                          </div>
                        </div>
                        <div className="border-bottom pt-10 pb-10" />
                        <div className="job-overview">
                          <h5 className="border-bottom pb-15 mb-30">Overview</h5>
                          <div className="row">
                            {job.title && (
                              <div className="col-md-6 d-flex">
                                <div className="sidebar-icon-item"><span className="icon">📝</span></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Title</span>
                                  <strong className="small-heading">{job.title}</strong>
                                </div>
                              </div>
                            )}
                            {job.location && (
                              <div className="col-md-6 d-flex">
                                <div className="sidebar-icon-item"><img src="/assets/imgs/page/job-single/location.svg" alt="jobBox" /></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Location</span>
                                  <strong className="small-heading">{job.location}</strong>
                                </div>
                              </div>
                            )}
                            {job.salaryRange && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><img src="/assets/imgs/page/job-single/salary.svg" alt="jobBox" /></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description salary-icon mb-10">Salary</span>
                                  <strong className="small-heading">{job.salaryRange}</strong>
                                </div>
                              </div>
                            )}
                            {job.jobType && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><span className="icon">💼</span></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Job Type</span>
                                  <strong className="small-heading">{job.jobType}</strong>
                                </div>
                              </div>
                            )}
                            {job.category && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><img src="/assets/imgs/page/job-single/job-type.svg" alt="jobBox" /></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description jobtype-icon mb-10">Category</span>
                                  <strong className="small-heading">{job.category}</strong>
                                </div>
                              </div>
                            )}
                            {job.requiredSkills && job.requiredSkills.length > 0 && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><span className="icon">🛠️</span></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Required Skills</span>
                                  <strong className="small-heading">{job.requiredSkills.join(", ")}</strong>
                                </div>
                              </div>
                            )}
                            {typeof job.minExperience !== 'undefined' && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><span className="icon">⏳</span></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Min Experience</span>
                                  <strong className="small-heading">{job.minExperience} years</strong>
                                </div>
                              </div>
                            )}
                            {job.requiredDegree && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><span className="icon">🎓</span></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Required Degree</span>
                                  <strong className="small-heading">{job.requiredDegree}</strong>
                                </div>
                              </div>
                            )}
                            {job.createdAt && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><span className="icon">🗓️</span></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Created At</span>
                                  <strong className="small-heading">{new Date(job.createdAt).toLocaleDateString()}</strong>
                                </div>
                              </div>
                            )}
                            {job.endAt && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><img src="/assets/imgs/page/job-single/deadline.svg" alt="jobBox" /></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Deadline</span>
                                  <strong className="small-heading">{new Date(job.endAt).toLocaleDateString()}</strong>
                                </div>
                              </div>
                            )}
                            {job.status && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><span className="icon">🔖</span></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Status</span>
                                  <strong className="small-heading">{job.status}</strong>
                                </div>
                              </div>
                            )}
                            {job.employer && job.employer.name && (
                              <div className="col-md-6 d-flex mt-sm-15">
                                <div className="sidebar-icon-item"><span className="icon">🏢</span></div>
                                <div className="sidebar-text-info ml-10">
                                  <span className="text-description mb-10">Employer</span>
                                  <strong className="small-heading">{job.employer.name}</strong>
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                        <div className="content-single">
                          <p>{job.description}</p>
                        </div>
                        <div className="author-single">
                          <span>{job.employerName}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
                  <div className="sidebar-border">
                    <div className="sidebar-heading">
                      <div className="avatar-sidebar">
                        <figure>
                          <img alt="jobBox" src="/assets/imgs/page/job-single/avatar.png" />
                        </figure>
                        <div className="sidebar-info">
                          <span className="sidebar-company">AliThemes</span>
                          <span className="card-location">New York, US</span>
                          <Link href="#">
                            <span className="link-underline mt-15">02 Open Jobs</span>
                          </Link>
                        </div>
                      </div>
                    </div>
                    <div className="sidebar-list-job">
                      <div className="box-map">
                        <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2970.3150609575905!2d-87.6235655!3d41.886080899999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x880e2ca8b34afe61%3A0x6caeb5f721ca846!2s205%20N%20Michigan%20Ave%20Suit%20810%2C%20Chicago%2C%20IL%2060601%2C%20Hoa%20K%E1%BB%B3!5e0!3m2!1svi!2s!4v1658551322537!5m2!1svi!2s" allowFullScreen loading="lazy" referrerPolicy="no-referrer-when-downgrade" />
                      </div>
                      <ul className="ul-disc">
                        <li>205 North Michigan Avenue, Suite 810 Chicago, 60601, USA</li>
                        <li>Phone: (123) 456-7890</li>
                        <li>Email: contact@Evara.com</li>
                      </ul>
                    </div>
                  </div>
                  <div className="sidebar-border">
                    <h6 className="f-18">Similar jobs</h6>
                    <div className="sidebar-list-job">
                      <ul>
                        <li>
                          <div className="card-list-4 wow animate__animated animate__fadeIn hover-up">
                            <div className="image">
                              <Link href="/job-details">
                                <span>
                                  <img src="/assets/imgs/brands/brand-1.png" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                            <div className="info-text">
                              <h5 className="font-md font-bold color-brand-1">
                                <Link href="/job-details">
                                  <span>UI / UX Designer fulltime</span>
                                </Link>
                              </h5>
                              <div className="mt-0">
                                <span className="card-briefcase">Fulltime</span>
                                <span className="card-time">
                                  <span>3</span>
                                  <span> mins ago</span>
                                </span>
                              </div>
                              <div className="mt-5">
                                <div className="row">
                                  <div className="col-6">
                                    <h6 className="card-price">
                                      $250<span>/Hour</span>
                                    </h6>
                                  </div>
                                  <div className="col-6 text-end">
                                    <span className="card-briefcase">New York, US</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="card-list-4 wow animate__animated animate__fadeIn hover-up">
                            <div className="image">
                              <Link href="/job-details">
                                <span>
                                  <img src="/assets/imgs/brands/brand-2.png" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                            <div className="info-text">
                              <h5 className="font-md font-bold color-brand-1">
                                <Link href="/job-details">
                                  <span>Java Software Engineer</span>
                                </Link>
                              </h5>
                              <div className="mt-0">
                                <span className="card-briefcase">Fulltime</span>
                                <span className="card-time">
                                  <span>5</span>
                                  <span> mins ago</span>
                                </span>
                              </div>
                              <div className="mt-5">
                                <div className="row">
                                  <div className="col-6">
                                    <h6 className="card-price">
                                      $500<span>/Hour</span>
                                    </h6>
                                  </div>
                                  <div className="col-6 text-end">
                                    <span className="card-briefcase">Tokyo, Japan</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="card-list-4 wow animate__animated animate__fadeIn hover-up">
                            <div className="image">
                              <Link href="/job-details">
                                <span>
                                  <img src="/assets/imgs/brands/brand-3.png" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                            <div className="info-text">
                              <h5 className="font-md font-bold color-brand-1">
                                <Link href="/job-details">
                                  <span>Frontend Developer</span>
                                </Link>
                              </h5>
                              <div className="mt-0">
                                <span className="card-briefcase">Fulltime</span>
                                <span className="card-time">
                                  <span>8</span>
                                  <span> mins ago</span>
                                </span>
                              </div>
                              <div className="mt-5">
                                <div className="row">
                                  <div className="col-6">
                                    <h6 className="card-price">
                                      $650<span>/Hour</span>
                                    </h6>
                                  </div>
                                  <div className="col-6 text-end">
                                    <span className="card-briefcase">Hanoi, Vietnam</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="card-list-4 wow animate__animated animate__fadeIn hover-up">
                            <div className="image">
                              <Link href="/job-details">
                                <span>
                                  <img src="/assets/imgs/brands/brand-4.png" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                            <div className="info-text">
                              <h5 className="font-md font-bold color-brand-1">
                                <Link href="/job-details">
                                  <span>Cloud Engineer</span>
                                </Link>
                              </h5>
                              <div className="mt-0">
                                <span className="card-briefcase">Fulltime</span>
                                <span className="card-time">
                                  <span>12</span>
                                  <span> mins ago</span>
                                </span>
                              </div>
                              <div className="mt-5">
                                <div className="row">
                                  <div className="col-6">
                                    <h6 className="card-price">
                                      $380<span>/Hour</span>
                                    </h6>
                                  </div>
                                  <div className="col-6 text-end">
                                    <span className="card-briefcase">Losangl, Au</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="card-list-4 wow animate__animated animate__fadeIn hover-up">
                            <div className="image">
                              <Link href="/job-details">
                                <span>
                                  <img src="/assets/imgs/brands/brand-5.png" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                            <div className="info-text">
                              <h5 className="font-md font-bold color-brand-1">
                                <Link href="/job-details">
                                  <span>DevOps Engineer</span>
                                </Link>
                              </h5>
                              <div className="mt-0">
                                <span className="card-briefcase">Fulltime</span>
                                <span className="card-time">
                                  <span>34</span>
                                  <span> mins ago</span>
                                </span>
                              </div>
                              <div className="mt-5">
                                <div className="row">
                                  <div className="col-6">
                                    <h6 className="card-price">
                                      $140<span>/Hour</span>
                                    </h6>
                                  </div>
                                  <div className="col-6 text-end">
                                    <span className="card-briefcase">Paris, France</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="card-list-4 wow animate__animated animate__fadeIn hover-up">
                            <div className="image">
                              <Link href="/job-details">
                                <span>
                                  <img src="/assets/imgs/brands/brand-6.png" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                            <div className="info-text">
                              <h5 className="font-md font-bold color-brand-1">
                                <Link href="/job-details">
                                  <span>Figma design UI/UX</span>
                                </Link>
                              </h5>
                              <div className="mt-0">
                                <span className="card-briefcase">Fulltime</span>
                                <span className="card-time">
                                  <span>45</span>
                                  <span> mins ago</span>
                                </span>
                              </div>
                              <div className="mt-5">
                                <div className="row">
                                  <div className="col-6">
                                    <h6 className="card-price">
                                      $290<span>/Hour</span>
                                    </h6>
                                  </div>
                                  <div className="col-6 text-end">
                                    <span className="card-briefcase">New York, US</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="card-list-4 wow animate__animated animate__fadeIn hover-up">
                            <div className="image">
                              <Link href="/job-details">
                                <span>
                                  <img src="/assets/imgs/brands/brand-7.png" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                            <div className="info-text">
                              <h5 className="font-md font-bold color-brand-1">
                                <Link href="/job-details">
                                  <span>Product Manage</span>
                                </Link>
                              </h5>
                              <div className="mt-0">
                                <span className="card-briefcase">Fulltime</span>
                                <span className="card-time">
                                  <span>50</span>
                                  <span> mins ago</span>
                                </span>
                              </div>
                              <div className="mt-5">
                                <div className="row">
                                  <div className="col-6">
                                    <h6 className="card-price">
                                      $650<span>/Hour</span>
                                    </h6>
                                  </div>
                                  <div className="col-6 text-end">
                                    <span className="card-briefcase">New York, US</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                        <li>
                          <div className="card-list-4 wow animate__animated animate__fadeIn hover-up">
                            <div className="image">
                              <Link href="/job-details">
                                <span>
                                  <img src="/assets/imgs/brands/brand-8.png" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                            <div className="info-text">
                              <h5 className="font-md font-bold color-brand-1">
                                <Link href="/job-details">
                                  <span>UI / UX Designer</span>
                                </Link>
                              </h5>
                              <div className="mt-0">
                                <span className="card-briefcase">Fulltime</span>
                                <span className="card-time">
                                  <span>58</span>
                                  <span> mins ago</span>
                                </span>
                              </div>
                              <div className="mt-5">
                                <div className="row">
                                  <div className="col-6">
                                    <h6 className="card-price">
                                      $270<span>/Hour</span>
                                    </h6>
                                  </div>
                                  <div className="col-6 text-end">
                                    <span className="card-briefcase">New York, US</span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </li>
                      </ul>
                    </div>
                  </div>
                  <div className="sidebar-border">
                    <h6 className="f-18">Tags</h6>
                    <div className="sidebar-list-job">
                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">App</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Digital</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Marketing</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Conten Writer</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Sketch</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">PSD</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Laravel</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">React JS</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">HTML</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Finance</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Manager</span>
                      </Link>

                      <Link href="/jobs-grid">
                        <span className="btn btn-grey-small bg-14 mb-10 mr-5">Business</span>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-left">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">Featured Jobs</h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Get the latest news, updates and tips</p>
              </div>
              <div className="mt-50">
                <div className="box-swiper style-nav-top">
                  <FeaturedSlider />
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-20">
            <div className="container">
              <div className="box-newsletter">
                <div className="row">
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img src="/assets/imgs/template/newsletter-left.png" alt="joxBox" />
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
                    <img src="/assets/imgs/template/newsletter-right.png" alt="joxBox" />
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