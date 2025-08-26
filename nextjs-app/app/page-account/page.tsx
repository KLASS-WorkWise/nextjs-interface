"use client";

import Layout from "@/components/Layout/Layout";
import { useSession } from "next-auth/react";
import { useState, useRef, useEffect } from "react";
import { Camera } from 'lucide-react';

export default function AccountPage() {
    const { data: session } = useSession();
    // console.log("test thử ", session);

    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [avatar, setAvatar] = useState("/assets/imgs/avatar/logoLogin.jpg");
    const [message, setMessage] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        const fetchUser = async () => {
            const userId = session?.user?.id;
            if (userId) {
                const userRes = await fetch(`http://localhost:8080/api/users/${userId}`);
                const userData = await userRes.json();
                setFullName(userData.fullName || userData.name || "");
                setEmail(userData.email || "");
                setUsername(userData.username || "");
                // Nếu có avatar thì setAvatar(userData.avatar);
            }
        };
        fetchUser();
    }, [session]);

    const handleAvatarClick = () => setShowModal(true);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const handleRemove = () => setPreview(null);

    const handleUpdate = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage("");
        const accessToken = session?.accessToken;
        const userId = session?.user?.id;
        if (!accessToken || !userId) {
            setMessage("Bạn chưa đăng nhập hoặc token hết hạn!");
            return;
        }
        try {
            const res = await fetch(`http://localhost:8080/api/users/${userId}`, {
                method: "PATCH",
                headers: {
                    "Content-Type": "application/json",
                    // "Authorization": `Bearer ${accessToken}`,
                },
                body: JSON.stringify({
                    fullName,
                    email,
                    avatar,
                }),
            });
            if (res.ok) {
                setMessage("Cập nhật thành công!");
                // Fetch lại user từ backend để cập nhật giao diện
                const userRes = await fetch(`http://localhost:8080/api/users/${userId}`, {
                    headers: { "Authorization": `Bearer ${accessToken}` }
                });
                const userData = await userRes.json();
                setFullName(userData.fullName || userData.name || "");
                setEmail(userData.email || "");
                // Nếu có avatar thì setAvatar(userData.avatar);
            } else {
                setMessage("Có lỗi xảy ra, vui lòng thử lại.");
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
                                        <label className="form-label">Họ và tên </label>
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

                                    <div className="form-group mb-20">
                                        <label className="form-label">User Name </label>
                                        <input
                                            className="form-control"
                                            type="text"
                                            value={username}
                                            onChange={e => setUsername(e.target.value)}
                                            required
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
                                <div className="mb-2" style={{ position: "relative", display: "inline-block" }}>
                                    <img
                                        src={avatar}
                                        alt="Avatar"
                                        className="rounded-circle"
                                        style={{ width: 80, height: 80, objectFit: "cover" }}
                                    />
                                    {/* Icon camera ở góc avatar */}
                                    <span
                                        style={{
                                            position: "absolute",
                                            bottom: 0,
                                            background: "#fff",
                                            borderRadius: "50%",
                                            padding: 4,
                                            cursor: "pointer",
                                            boxShadow: "0 0 3px #aaa",
                                            border: "1px solid #eee",
                                            color: "blue"
                                        }}
                                        onClick={handleAvatarClick}
                                    >
                                        <Camera />
                                    </span>
                                </div>
                                <h5 className="mb-1">{fullName}</h5>
                                <div className="mb-1" style={{ color: "#555", fontSize: "15px" }}>{email}</div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Modal chọn ảnh đại diện */}
            {showModal && (
                <div className="modal" style={{
                    position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
                    background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 9999
                }}>
                    <div style={{ background: "#fff", padding: 30, borderRadius: 10, minWidth: 350 }}>
                        <h4 className="mb-3">CHỈNH SỬA ẢNH ĐẠI DIỆN</h4>
                        <div style={{ display: "flex", gap: 30 }}>
                            <div style={{ flex: 1, textAlign: "center" }}>
                                <div style={{ border: "1px dashed #2196f3", padding: 20, marginBottom: 10 }}>
                                    <input
                                        type="file"
                                        accept="image/*"
                                        ref={fileInputRef}
                                        style={{ display: "none" }}
                                        onChange={handleFileChange}
                                    />
                                    <div
                                        style={{ cursor: "pointer", minHeight: 100 }}
                                        onClick={() => fileInputRef.current?.click()}
                                    >
                                        {preview ? (
                                            <img src={preview} alt="Preview" style={{ maxWidth: "100%", maxHeight: 120 }} />
                                        ) : (
                                            <span>Click chọn ảnh để tải lên!</span>
                                        )}
                                    </div>
                                </div>
                                <div style={{ color: "red", fontSize: 13 }}>
                                    Nếu ảnh của bạn có dung lượng trên 10MB, vui lòng giảm dung lượng ảnh!
                                </div>
                            </div>
                            <div style={{ flex: 1, textAlign: "center" }}>
                                <img
                                    src={preview || avatar}
                                    alt="Avatar Preview"
                                    style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover", marginBottom: 10 }}
                                />
                                <div style={{ fontWeight: "bold", marginBottom: 10 }}>Ảnh hiển thị trên CV</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                                    <button className="btn btn-primary">Đổi ảnh</button>
                                    <button className="btn btn-danger" onClick={handleRemove}>Xóa ảnh</button>
                                    <button className="btn btn-success" onClick={() => setShowModal(false)}>Xong</button>
                                    <button className="btn btn-link" onClick={() => { setShowModal(false); setPreview(null); }}>Đóng lại (Không lưu)</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}