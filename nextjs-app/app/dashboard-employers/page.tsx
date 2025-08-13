"use client";

import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Layout from "@/components/Layout/Layout";

export default function DashboardEmployers() {
    const { data: session, status } = useSession();
    const router = useRouter();

    if (status === "loading") return <div>Loading...</div>;
    if (!session) {
        router.push("/page-signin");
        return null;
    }

    return (
        <Layout>
            <div className="container pt-100 pb-100">
                <h1>Employer Dashboard</h1>
                <p>Chào mừng {session.user?.name || session.user?.email} đến với trang quản lý nhà tuyển dụng!</p>
                {/* Thêm nội dung dashboard tại đây */}
            </div>
        </Layout>
    );
}
