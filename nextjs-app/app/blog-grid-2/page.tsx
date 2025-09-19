/* eslint-disable react/no-unescaped-entities */
"use client";

import Link from "next/link";
import Layout from "@/components/Layout/Layout";
import { useEffect, useState } from "react";
import { blogApi } from "@/lib/blog/blog-api";
import { BlogResponseDto } from "@/lib/blog/blog-api";

export default function BlogGrid2() {
  const [blogs, setBlogs] = useState<BlogResponseDto[]>([]);
  const [featuredBlog, setFeaturedBlog] = useState<BlogResponseDto | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const blogsData = await blogApi.getAllBlogs();
        setBlogs(blogsData);

        // Lấy blog đầu tiên làm featured blog
        if (blogsData.length > 0) {
          setFeaturedBlog(blogsData[0]);
        }
      } catch (err) {
        console.error("Error fetching blogs:", err);
        setError("Không thể tải dữ liệu blog");
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getReadTime = (content: string) => {
    const wordsPerMinute = 200;
    const wordCount = content.split(" ").length;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  if (loading) {
    return (
      <Layout>
        <div className="section-box">
          <div className="container">
            <div className="text-center">
              <div className="spinner-border" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-3">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (error) {
    return (
      <Layout>
        <div className="section-box">
          <div className="container">
            <div className="text-center">
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <>
      <Layout>
        <div>
          <section className="section-box">
            <div className="breacrumb-cover">
              <div className="container">
                <div className="row">
                  <div className="col-lg-6">
                    <h2 className="mb-10">Articles / News</h2>
                    <p className="font-lg color-text-paragraph-2">
                      Get the latest news, updates and tips
                    </p>
                  </div>
                  <div className="col-lg-6 text-end">
                    <ul className="breadcrumbs mt-40">
                      <li>
                        <Link href="index">
                          <span className="home-icon">Home</span>
                        </Link>
                      </li>
                      <li>Blog</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Featured Blog Section */}
          {featuredBlog && (
            <section className="section-box mt-50">
              <div className="container">
                <div className="box-improve">
                  <div className="row">
                    <div className="col-lg-5 col-md-12 col-sm-12">
                      <Link href={`/blog-details?id=${featuredBlog.id}`}>
                        <span>
                          <img
                            src={
                              featuredBlog.imageUrl ||
                              "assets/imgs/page/job-single-2/img2.png"
                            }
                            alt={featuredBlog.title}
                          />
                        </span>
                      </Link>
                    </div>
                    <div className="col-lg-7 col-md-12 col-sm-12">
                      <div className="pt-40 pb-30 pl-30 pr-30">
                        <Link href="blog-grid">
                          <span className="btn btn-tag">
                            {featuredBlog.category.name}
                          </span>
                        </Link>

                        <h2 className="mt-20 mb-20">
                          <Link href={`/blog-details?id=${featuredBlog.id}`}>
                            <span>{featuredBlog.title}</span>
                          </Link>
                        </h2>
                        <p className="font-md mb-20">
                          {featuredBlog.summary ||
                            featuredBlog.content.substring(0, 200) + "..."}
                        </p>
                        <div>
                          <Link href={`/blog-details?id=${featuredBlog.id}`}>
                            <span className="btn btn-arrow-right">
                              Read More
                            </span>
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          <section className="section-box mt-50">
            <div className="post-loop-grid">
              <div className="container">
                <div className="text-left">
                  <h2 className="section-title mb-10 wow animate__animated animate__fadeInUp">
                    Latest Posts
                  </h2>
                  <p className="font-lg color-text-paragraph-2 wow animate__animated animate__fadeInUp">
                    Don't miss the trending news
                  </p>
                </div>
                <div className="row mt-30 latest-posts">
                  <div className="col-lg-8">
                    <div className="row">
                      {blogs.slice(1).map((blog) => (
                        <div key={blog.id} className="col-lg-6 mb-30 d-flex">
                          <div className="card-grid-3 hover-up w-100 latest-card">
                            <div className="text-center card-grid-3-image">
                              <Link href={`/blog-details?id=${blog.id}`}>
                                <span>
                                  <figure>
                                    <img
                                      alt={blog.title}
                                      src={
                                        blog.imageUrl ||
                                        "assets/imgs/page/job-single-2/img3.png"
                                      }
                                    />
                                  </figure>
                                </span>
                              </Link>
                            </div>
                            <div className="card-block-info">
                              <div className="tags mb-15">
                                <Link href="blog-grid">
                                  <span className="btn btn-tag">
                                    {blog.category.name}
                                  </span>
                                </Link>
                              </div>
                              <h5>
                                <Link href={`/blog-details?id=${blog.id}`}>
                                  <span>{blog.title}</span>
                                </Link>
                              </h5>
                              <p className="mt-10 color-text-paragraph font-sm lp-line-clamp-4">
                                {blog.summary ||
                                  blog.content.substring(0, 150) + "..."}
                              </p>
                              <div className="card-2-bottom mt-20">
                                <div className="row">
                                  <div className="col-lg-6 col-6">
                                    <div className="d-flex">
                                      <div className="info-right-img">
                                        <span className="font-xs color-text-paragraph-2">
                                          {formatDate(blog.createdAt)}
                                        </span>
                                      </div>
                                    </div>
                                  </div>
                                  <div className="col-lg-6 text-end col-6 pt-15">
                                    <span className="color-text-paragraph-2 font-xs">
                                      {getReadTime(blog.content)} mins to read
                                    </span>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Pagination */}
                    <div className="paginations">
                      <ul className="pager">
                        <li>
                          <a className="pager-prev" href="#" />
                        </li>
                        <li>
                          <Link href="#">
                            <span className="pager-number active">1</span>
                          </Link>
                        </li>
                        <li>
                          <a className="pager-next" href="#" />
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Sidebar */}
                  <div className="col-lg-4 col-md-12 col-sm-12 col-12 pl-40 pl-lg-15 mt-lg-30">
                    <div className="widget_search mb-40">
                      <div className="search-form">
                        <form action="#">
                          <input type="text" placeholder="Search" />
                          <button type="submit">
                            <i className="fi-rr-search" />
                          </button>
                        </form>
                      </div>
                    </div>
                    <div className="sidebar-shadow sidebar-news-small">
                      <h5 className="sidebar-title">Trending Now</h5>
                      <div className="post-list-small">
                        {blogs.slice(0, 5).map((blog) => (
                          <div
                            key={blog.id}
                            className="post-list-small-item d-flex align-items-start"
                          >
                            <figure className="thumb mr-15">
                              <a href={`/blog-details?id=${blog.id}`}>
                                <img
                                  src={
                                    blog.imageUrl ||
                                    "assets/imgs/page/blog/img-trending.png"
                                  }
                                  alt={blog.title}
                                />
                              </a>
                            </figure>
                            <div className="content">
                              <h5>
                                <a href={`/blog-details?id=${blog.id}`}>
                                  {blog.title}
                                </a>
                              </h5>
                              <div className="post-meta text-muted d-flex align-items-center mb-15">
                                <div className="author d-flex align-items-center mr-20"></div>
                                <div className="date">
                                  <span>{formatDate(blog.createdAt)}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="sidebar-border-bg bg-right">
                      <span className="text-grey">WE ARE</span>
                      <span className="text-hiring">HIRING</span>
                      <p className="font-xxs color-text-paragraph mt-5">
                        Lorem ipsum dolor sit amet, consectetur adipisicing
                        elit. Recusandae architecto
                      </p>
                      <div className="mt-15">
                        <Link href="#">
                          <span className="btn btn-paragraph-2">Know More</span>
                        </Link>
                      </div>
                    </div>

                    <div className="sidebar-shadow sidebar-news-small">
                      <h5 className="sidebar-title">Gallery</h5>
                      <div className="post-list-small">
                        <ul className="gallery-3">
                          {blogs.map((blog) => (
                            <li key={blog.id}>
                              <Link href={`/blog-details?id=${blog.id}`}>
                                <span>
                                  <img
                                    src={
                                      blog.imageUrl ||
                                      "assets/imgs/page/blog/gallery1.png"
                                    }
                                    alt={blog.title}
                                  />
                                </span>
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
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
                    <img
                      src="assets/imgs/template/newsletter-left.png"
                      alt="joxBox"
                    />
                  </div>
                  <div className="col-lg-12 col-xl-6 col-12">
                    <h2 className="text-md-newsletter text-center">
                      New Things Will Always
                      <br /> Update Regularly
                    </h2>
                    <div className="box-form-newsletter mt-40">
                      <form className="form-newsletter">
                        <input
                          className="input-newsletter"
                          type="text"
                          placeholder="Enter your email here"
                        />
                        <button className="btn btn-default font-heading icon-send-letter">
                          Subscribe
                        </button>
                      </form>
                    </div>
                  </div>
                  <div className="col-xl-3 col-12 text-center d-none d-xl-block">
                    <img
                      src="assets/imgs/template/newsletter-right.png"
                      alt="joxBox"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      </Layout>
      <style jsx>{`
        /* Only affect Latest Posts grid */
        .latest-posts > .col-lg-8 .row > [class*="col-"] {
          display: flex;
        }
        .latest-card {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        .latest-card .card-grid-3-image img {
          width: 100%;
          height: 220px;
          object-fit: cover;
        }
        .latest-card .card-block-info {
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .latest-card .card-2-bottom {
          margin-top: auto;
        }
        .lp-line-clamp-3 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 3;
          overflow: hidden;
        }
        .lp-line-clamp-4 {
          display: -webkit-box;
          -webkit-box-orient: vertical;
          -webkit-line-clamp: 4;
          overflow: hidden;
        }

        /* Sidebar Trending Now thumbnails */
        .sidebar-news-small .post-list-small .thumb {
          width: 96px;
          height: 72px;
          flex: 0 0 96px;
          overflow: hidden;
          border-radius: 8px;
        }
        .sidebar-news-small .post-list-small .thumb img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
      `}</style>
    </>
  );
}
