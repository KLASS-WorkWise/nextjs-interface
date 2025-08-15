"use client";

/* eslint-disable @next/next/no-img-element */
import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import BlogSlider from "@/components/sliders/Blog";
import React, { useEffect, useState } from 'react';

interface CompanyInformation {
  id: number
  employee: number
  companyName: string
  logoUrl: string
  bannerUrl: string
  email: string
  phone: string
  description: string
  lastPosted: string
  address: string
  location: string
  website: string
  industry: string
}
interface PaginatedCompanyResponse {
  data: CompanyInformation[]
  pageNumber: number
  pageSize: number
  totalPages: number
  totalRecords: number
  hasNext: boolean
  hasPrevious: boolean
}

export default function CompaniesGrid() {
  const [companies, setCompanies] = useState<CompanyInformation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(12)
  const [totalRecords, setTotalRecords] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  const fetchCompanies = async (page = 0, size = 12) => {
    try {
      setLoading(true)
      const response = await fetch(`http://localhost:8080/api/company?page=${page}&size=${size}`)

      if (!response.ok) {
        throw new Error("Failed to fetch companies")
      }

      const data: PaginatedCompanyResponse = await response.json()
      setCompanies(data.data)
      setCurrentPage(data.pageNumber)
      setTotalRecords(data.totalRecords)
      setTotalPages(data.totalPages)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred")
      setCompanies([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCompanies(currentPage, pageSize)
  }, [currentPage, pageSize])

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage)
  }

  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize)
    setCurrentPage(0) // Reset to first page when changing page size
  }

  return (
    <>
      <Layout>
        <div>
          <section className="section-box-2">
            <div className="container">
              <div className="banner-hero banner-company">
                <div className="block-banner text-center">
                  <h3 className="wow animate__animated animate__fadeInUp">Browse Companies</h3>
                  <div className="font-sm color-text-paragraph-2 mt-10 wow animate__animated animate__fadeInUp" data-wow-delay=".1s">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Vero repellendus magni, <br className="d-none d-xl-block" />
                    atque delectus molestias quis?
                  </div>
                  <div className="box-list-character">
                    <ul>
                      <li>
                        <Link href="#">
                          <span className="active">A</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>B</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>C</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>D</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>E</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>F</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>G</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>H</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>I</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>J</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>K</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>L</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>M</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>N</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>O</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>P</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>Q</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>R</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>S</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>T</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>U</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>V</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>W</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>X</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>Y</span>
                        </Link>
                      </li>
                      <li>
                        <Link href="#">
                          <span>Z</span>
                        </Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-30">
            <div className="container">
              <div className="row flex-row-reverse">
                <div className="col-lg-9 col-md-12 col-sm-12 col-12 float-right">
                  <div className="content-page">
                    <div className="box-filters-job">
                      <div className="row">
                        <div className="col-xl-6 col-lg-5">
                          <span className="text-small text-showing">
                            Showing{" "}
                            <strong>
                              {currentPage * pageSize + 1}-{Math.min((currentPage + 1) * pageSize, totalRecords)}{" "}
                            </strong>
                            of <strong>{totalRecords} </strong>companies
                          </span>
                        </div>
                        <div className="col-xl-6 col-lg-7 text-lg-end mt-sm-15">
                          <div className="display-flex2">
                            <div className="box-border mr-10">
                              <span className="text-sortby">Show:</span>
                              <div className="dropdown dropdown-sort">
                                <button
                                  className="btn dropdown-toggle"
                                  id="dropdownSort"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  data-bs-display="static"
                                >
                                  <span>{pageSize}</span>
                                  <i className="fi-rr-angle-small-down" />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort">
                                  <li>
                                    <button onClick={() => handlePageSizeChange(6)} className="dropdown-item">
                                      6
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handlePageSizeChange(12)} className="dropdown-item">
                                      12
                                    </button>
                                  </li>
                                  <li>
                                    <button onClick={() => handlePageSizeChange(24)} className="dropdown-item">
                                      24
                                    </button>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="box-border">
                              <span className="text-sortby">Sort by:</span>
                              <div className="dropdown dropdown-sort">
                                <button
                                  className="btn dropdown-toggle"
                                  id="dropdownSort2"
                                  type="button"
                                  data-bs-toggle="dropdown"
                                  aria-expanded="false"
                                  data-bs-display="static"
                                >
                                  <span>Newest Post</span>
                                  <i className="fi-rr-angle-small-down" />
                                </button>
                                <ul className="dropdown-menu dropdown-menu-light" aria-labelledby="dropdownSort2">
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item active">Newest Post</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">Oldest Post</span>
                                    </Link>
                                  </li>
                                  <li>
                                    <Link href="#">
                                      <span className="dropdown-item">Rating Post</span>
                                    </Link>
                                  </li>
                                </ul>
                              </div>
                            </div>
                            <div className="box-view-type">
                              <Link href="/jobs-list">
                                <span className="view-type">
                                  <img src="assets/imgs/template/icons/icon-list.svg" alt="jobBox" />
                                </span>
                              </Link>
                              <Link href="/jobs-grid">
                                <span className="view-type">
                                  <img src="assets/imgs/template/icons/icon-grid-hover.svg" alt="jobBox" />
                                </span>
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {loading && (
                      <div className="text-center py-5">
                        <div className="spinner-border" role="status">
                          <span className="visually-hidden">Loading...</span>
                        </div>
                        <p className="mt-3">Loading companies...</p>
                      </div>
                    )}

                    {error && (
                      <div className="alert alert-danger" role="alert">
                        <h4 className="alert-heading">Error!</h4>
                        <p>{error}</p>
                        <button
                          className="btn btn-outline-danger"
                          onClick={() => fetchCompanies(currentPage, pageSize)}
                        >
                          Try Again
                        </button>
                      </div>
                    )}

                    {!loading && !error && (
                      <div className="row">
                        {companies.map((company) => (
                          <div key={company.id} className="col-xl-4 col-lg-4 col-md-6 col-sm-12 col-12">
                            <div className="card-grid-1 hover-up wow animate__animated animate__fadeIn">
                              <div className="image-box">
                                <Link href={`/company-details/${company.id}`}>
                                  <span>
                                    <img
                                      src={company.logoUrl || "/placeholder.svg?height=80&width=80&query=company logo"}
                                      alt={company.companyName}
                                      onError={(e) => {
                                        const target = e.target as HTMLImageElement
                                        target.src = "/placeholder.svg?height=80&width=80"
                                      }}
                                    />
                                  </span>
                                </Link>
                              </div>
                              <div className="info-text mt-10">
                                <h5 className="font-bold">
                                  <Link href={`/company-details/${company.id}`}>
                                    <span>{company.companyName}</span>
                                  </Link>
                                </h5>
                                <div className="mt-5">
                                  {/* Static rating for now - you can make this dynamic later */}
                                  <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                                  <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                                  <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                                  <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                                  <img alt="jobBox" src="assets/imgs/template/icons/star.svg" />
                                  <span className="font-xs color-text-mutted ml-10">
                                    <span>(4.5)</span>
                                  </span>
                                </div>
                                <span className="card-location">{company.location}</span>
                                <div className="mt-15">
                                  <p className="font-xs color-text-paragraph-2 mb-15">
                                    {company.description?.substring(0, 100)}
                                    {company.description && company.description.length > 100 ? "..." : ""}
                                  </p>
                                  <div className="card-2-bottom mt-20">
                                    <div className="row">
                                      <div className="col-lg-6 col-6">
                                        <span className="card-text-price">
                                          <strong>{company.employee}</strong> Employees
                                        </span>
                                      </div>
                                      <div className="col-lg-6 col-6 text-end">
                                        <span className="text-muted font-xs">{company.industry}</span>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-30">
                                  <Link href={`/jobs-grid?company=${company.id}`}>
                                    <span className="btn btn-grey-big">View Jobs</span>
                                  </Link>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {!loading && !error && totalPages > 1 && (
                      <div className="paginations">
                        <ul className="pager">
                          <li>
                            <button
                              className={`pager-prev ${currentPage === 0 ? "disabled" : ""}`}
                              onClick={() => handlePageChange(currentPage - 1)}
                              disabled={currentPage === 0}
                            >
                              Previous
                            </button>
                          </li>
                          {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                            const pageNum = Math.max(0, Math.min(currentPage - 2 + i, totalPages - 1))
                            return (
                              <li key={pageNum}>
                                <button
                                  className={`pager-number ${currentPage === pageNum ? "active" : ""}`}
                                  onClick={() => handlePageChange(pageNum)}
                                >
                                  {pageNum + 1}
                                </button>
                              </li>
                            )
                          })}
                          <li>
                            <button
                              className={`pager-next ${currentPage >= totalPages - 1 ? "disabled" : ""}`}
                              onClick={() => handlePageChange(currentPage + 1)}
                              disabled={currentPage >= totalPages - 1}
                            >
                              Next
                            </button>
                          </li>
                        </ul>
                      </div>
                    )}
                  </div>
                </div>

                {/* ... existing sidebar code ... */}
                <div className="col-lg-3 col-md-12 col-sm-12 col-12">
                  <div className="sidebar-shadow none-shadow mb-30">
                    <div className="sidebar-filters">
                      <div className="filter-block head-border mb-30">
                        <h5>
                          Advance Filter{" "}
                          <Link href="#">
                            <span className="link-reset">Reset</span>
                          </Link>
                        </h5>
                      </div>
                      <div className="filter-block mb-30">
                        <div className="form-group select-style">
                          <select className="form-control form-icons select-active">
                            <option>New York, US</option>
                            <option>London</option>
                            <option>Paris</option>
                            <option>Berlin</option>
                          </select>
                          <i className="fi-rr-marker" />
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-15">Industry</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" defaultChecked />
                                <span className="text-small">All</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">180</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Software</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">12</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Finance</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">23</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Recruting</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">43</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Management</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">Advertising</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">76</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                      <div className="filter-block mb-20">
                        <h5 className="medium-heading mb-25">Company size</h5>
                        <div className="form-group">
                          <ul className="list-checkbox">
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">0-50 Employees</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">143</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">51-150 Employees</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">65</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">151-300 Employees</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">76</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">301-500 Employees</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">89</span>
                            </li>
                            <li>
                              <label className="cb-container">
                                <input type="checkbox" />
                                <span className="text-small">500+ Employees</span>
                                <span className="checkmark" />
                              </label>
                              <span className="number-item">34</span>
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>
          <section className="section-box mt-50 mb-50">
            <div className="container">
              <div className="text-start">
                <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">News and Blog</h2>
                <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">Get the latest news, updates and tips</p>
              </div>
            </div>
            <div className="container">
              <div className="mt-50">
                <div className="box-swiper style-nav-top">
                  <BlogSlider />
                </div>
                <div className="text-center">
                  <Link href="blog-grid">
                    <span className="btn btn-brand-1 btn-icon-load mt--30 hover-up">Load More Posts</span>
                  </Link>
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
