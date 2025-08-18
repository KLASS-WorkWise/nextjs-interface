"use client";

import Layout from "@/components/Layout/Layout";
import { useSession } from "next-auth/react";
import { useState, useRef } from "react";

export default function AccountPage() {
    const { data: session } = useSession();
    const [fullName, setFullName] = useState(session?.user?.fullName || "");
    const [email] = useState(session?.user?.email || "");
    const [avatar, setAvatar] = useState("/assets/imgs/avatar/logoLogin.jpg");
    const [message, setMessage] = useState("");
    const [jobSearch, setJobSearch] = useState(false);
    const [allowSearch, setAllowSearch] = useState(true);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        try {
            const res = await fetch("http://localhost:8080/api/user/update", {
                method: "PATCH",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ fullName, avatar, jobSearch, allowSearch }),
            });
            if (res.ok) {
                setMessage("Cập nhật thành công!");
            } else {
                setMessage("Có lỗi xảy ra, vui lòng thử lại.");
            }
        } catch {
            setMessage("Không thể kết nối đến server.");
        }
    };

    const handleAvatarChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const formData = new FormData();
        formData.append("avatar", file);
        try {
            const res = await fetch("http://localhost:8080/api/user/upload-avatar", {
                method: "POST",
                body: formData,
            });
            const data = await res.json();
            if (res.ok && data.url) {
                setAvatar(data.url);
                setMessage("Đổi ảnh thành công!");
            } else {
                setMessage("Đổi ảnh thất bại.");
            }
        } catch {
            setMessage("Không thể kết nối đến server.");
        }
    };

    return (
        <Layout>
            <section className="pt-100">
                <div className="container">
                    <div className="row">
                        {/* Thông tin cá nhân */}
                        <div className="col-lg-7 col-md-12">
                            <div className="card p-4 mb-4">
                                <h4 className="mb-3">Cài đặt thông tin cá nhân</h4>
                                <form onSubmit={handleUpdate}>
                                    <div className="form-group mb-20">
                                        <label className="form-label">Họ và tên *</label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={fullName}
                                            onChange={e => setFullName(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group mb-20">
                                        <label className="form-label">Email</label>
                                        <input
                                            className="form-control"
                                            type="email"
                                            value={email}
                                            disabled
                                        />
                                    </div>
                                    <button className="btn btn-success w-100" type="submit">
                                        Lưu
                                    </button>
                                    {message && <div className="alert alert-info text-center mt-2">{message}</div>}
                                </form>
                            </div>
                        </div>
                        {/* Thông tin tài khoản */}
                        <div className="col-lg-5 col-md-12">
                            <div className="card p-4 mb-4 text-center">
                                <div className="mb-2">
                                    <img
                                        src={avatar}
                                        alt="Avatar"
                                        className="rounded-circle"
                                        style={{ width: 80, height: 80, objectFit: "cover" }}
                                        onClick={() => fileInputRef.current?.click()}
                                    />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        style={{ display: "none" }}
                                        ref={fileInputRef}
                                        onChange={handleAvatarChange}
                                    />
                                </div>
                                <h5 className="mb-1">{fullName}</h5>
                                <div className="mb-1" style={{ color: "#555", fontSize: "15px" }}>{email}</div>
                                <span className="badge bg-secondary mb-2">Tài khoản đã xác thực</span>
                                <button
                                    type="button"
                                    className="btn btn-outline-primary btn-sm mb-3"
                                    onClick={() => fileInputRef.current?.click()}
                                >
                                    Nâng cấp tài khoản
                                </button>
                                <div className="form-check form-switch mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={jobSearch}
                                        onChange={() => setJobSearch(!jobSearch)}
                                        id="jobSearchSwitch"
                                    />
                                    <label className="form-check-label" htmlFor="jobSearchSwitch">
                                        Đang Tắt tìm việc
                                    </label>
                                </div>
                                <div className="form-check form-switch mb-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={allowSearch}
                                        onChange={() => setAllowSearch(!allowSearch)}
                                        id="allowSearchSwitch"
                                    />
                                    <label className="form-check-label" htmlFor="allowSearchSwitch">
                                        Cho phép NTD tìm kiếm hồ sơ
                                    </label>
                                </div>
                                <div className="text-start mt-3">
                                    <ul className="list-unstyled">
                                        <li>✔ Nhắn tin qua Top Connect trên TopCV</li>
                                        <li>✔ Email và Số điện thoại của bạn</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </Layout>
    );
}