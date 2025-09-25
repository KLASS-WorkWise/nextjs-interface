"use client";
/* eslint-disable @next/next/no-img-element */
import Layout from "@/components/Layout/Layout";
import CategorySlider from "@/components/sliders/Category";
import TopRekruterSlider from "@/components/sliders/TopRekruter";
import BlogSlider from "@/components/sliders/Blog";
import CategoryTab from "@/components/elements/CategoryTab";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import JobChatBot from "./ChatBotJob/page";
import { motion } from "framer-motion";

export default function Home() {
  const router = useRouter();
  const [location, setLocation] = useState("");
  const [keyword, setKeyword] = useState("");
  const [salary, setSalary] = useState("");
  const [isChatOpen, setIsChatOpen] = useState(false);
  // Banner VIP active
  const [vipBanner, setVipBanner] = useState<any>(null);

  useEffect(() => {
    const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";
    fetch(`${API_URL}/api/banners/active?position=home_hero`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setVipBanner(data[0]);
        } else {
          setVipBanner(null);
        }
      })
      .catch(() => setVipBanner(null));
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (location) params.set("location", location);
    if (keyword) params.set("keyword", keyword);
    if (salary) params.set("salary", salary);
    router.push(`/jobs-grid?${params.toString()}`);
  };

  return (
    <>
      <Layout>
        <div className="bg-homepage1" />
        <section className="section-box">
          <div className="banner-hero hero-1">
            <div className="banner-inner">
              <div className="row">
                <div className="col-xl-8 col-lg-12">
                  <div className="block-banner">
                    <h1 className="heading-banner wow animate__animated animate__fadeInUp">
                      The <span className="color-brand-2">Easiest Way</span>
                      <br className="d-none d-lg-block" />
                      to Get Your New Job
                    </h1>
                    <div
                      className="banner-description mt-20 wow animate__animated animate__fadeInUp"
                      data-wow-delay=".1s"
                    >
                      Each month, more than 3 million job seekers turn to{" "}
                      <br className="d-none d-lg-block" />
                      website in their search for work, making over 140,000{" "}
                      <br className="d-none d-lg-block" />
                      applications every single day
                    </div>
                    <div
                      className="form-find mt-40 wow animate__animated animate__fadeIn"
                      data-wow-delay=".2s"
                    >
                      <form onSubmit={handleSearch}>
                        <div className="box-industry">
                          <select
                            className="form-input mr-10 select-active  input-location"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                          >
                            <option value="">Location</option>
                            <option value="Hà Nội">Hà Nội</option>
                            <option value="Hải Phòng">Hải Phòng</option>
                            <option value="Đà Nẵng">Đà Nẵng</option>
                            <option value="Huế">Huế</option>
                            <option value="Cần Thơ">Cần Thơ</option>
                            <option value="HCM">Thành phố Hồ Chí Minh</option>
                            <option value="An Giang">An Giang</option>
                            <option value="Bắc Ninh">Bắc Ninh</option>
                            <option value="Cà Mau">Cà Mau</option>
                            <option value="Cao Bằng">Cao Bằng</option>
                            <option value="Đắk Lắk">Đắk Lắk</option>
                            <option value="Điện Biên">Điện Biên</option>
                            <option value="Đồng Nai">Đồng Nai</option>
                            <option value="Đồng Tháp">Đồng Tháp</option>
                            <option value="Gia Lai">Gia Lai</option>
                            <option value="Hà Tĩnh">Hà Tĩnh</option>
                            <option value="Hưng Yên">Hưng Yên</option>
                            <option value="Khánh Hòa">Khánh Hòa</option>
                            <option value="Lai Châu">Lai Châu</option>
                            <option value="Lạng Sơn">Lạng Sơn</option>
                            <option value="Lào Cai">Lào Cai</option>
                            <option value="Lâm Đồng">Lâm Đồng</option>
                            <option value="Nghệ An">Nghệ An</option>
                            <option value="Ninh Bình">Ninh Bình</option>
                            <option value="Phú Thọ">Phú Thọ</option>
                            <option value="Quảng Ngãi">Quảng Ngãi</option>
                            <option value="Quảng Ninh">Quảng Ninh</option>
                            <option value="Quảng Trị">Quảng Trị</option>
                            <option value="Sơn La">Sơn La</option>
                            <option value="Tây Ninh">Tây Ninh</option>
                            <option value="Thái Nguyên">Thái Nguyên</option>
                            <option value="Thanh Hóa">Thanh Hóa</option>
                            <option value="Tuyên Quang">Tuyên Quang</option>
                            <option value="Vĩnh Long">Vĩnh Long</option>
                          </select>
                        </div>
                        <div className="box-industry">
                          <select
                            className="form-input mr-10 select-active input-location"
                            value={salary}
                            onChange={(e) => setSalary(e.target.value)}
                          >
                            <option value="">Salary</option>
                            <option value="Duới 20 triệu">Duới 20 triệu</option>
                            <option value="20 - 50 triệu">20 - 50 triệu</option>
                            <option value="50 - 70 triệu">50 - 70 triệu</option>
                            <option value="70 - 100 triệu">70 - 100 triệu</option>
                            <option value="Trên 100 triệu">Trên 100 triệu</option>
                          </select>
                        </div>
                        <input
                          className="form-input input-keysearch mr-10"
                          type="text"
                          placeholder="Your keyword... "
                          value={keyword}
                          onChange={(e) => setKeyword(e.target.value)}
                        />
                        <button className="btn btn-default btn-find font-sm">
                          Search
                        </button>
                      </form>
                    </div>
                  </div>
                </div>
                <div className="col-xl-4 col-lg-12 d-none d-xl-block col-md-6">
                  {/* Banner VIP logic: nếu có banner active thì thay thế block này */}
{vipBanner ? (
  <div className="banner-imgs">
    <motion.img
      src={vipBanner.bannerImage}
      alt={vipBanner.bannerTitle || "Banner"}
      style={{ width: "100%", borderRadius: "12px" }}
      initial={{ y: 0, x: 0 }}
      animate={{ 
        y: [0, -20, 0, 15, 0],  // lên xuống
        x: [0, 10, 0, -10, 0]   // trái phải
      }}
      transition={{
        duration: 6,    // thời gian chạy hết 1 vòng
        repeat: Infinity, // lặp vô hạn
        ease: "easeInOut"
      }}
    />
  </div>
) : (
                    <div className="banner-imgs">
                      <div className="block-1 shape-1">
                        <img
                          className="img-responsive"
                          alt="jobBox"
                          src="assets/imgs/page/homepage1/banner1.png"
                        />
                      </div>
                      <div className="block-2 shape-2">
                        <img
                          className="img-responsive"
                          alt="jobBox"
                          src="assets/imgs/page/homepage1/banner2.png"
                        />
                      </div>
                      <div className="block-3 shape-3">
                        <img
                          className="img-responsive"
                          alt="jobBox"
                          src="assets/imgs/page/homepage1/icon-top-banner.png"
                        />
                      </div>
                      <div className="block-4 shape-3">
                        <img
                          className="img-responsive"
                          alt="jobBox"
                          src="assets/imgs/page/homepage1/icon-bottom-banner.png"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="mt-100" />
        {/* ...các section khác giữ nguyên... */}
      </Layout>
      <JobChatBot isOpen={isChatOpen} setIsOpen={setIsChatOpen} />
      {/* <SocialIcons isChatOpen={isChatOpen} /> */}
    </>
  );
}