// "use client";

// import { useState, useRef, useEffect } from "react";
// import ReactMarkdown from "react-markdown";
// import { Send, X } from "lucide-react";
// import { WechatOutlined } from '@ant-design/icons';
// import { AliwangwangOutlined } from '@ant-design/icons';


// export default function JobChatBot() {
//     const [input, setInput] = useState("");
//     const [loading, setLoading] = useState(false);
//     type Message = { type: "user" | "bot"; content: string; time: string };
//     const [messages, setMessages] = useState<Message[]>([]);
//     const [showTyping, setShowTyping] = useState(false);
//     const [isOpen, setIsOpen] = useState(false);
//     const chatEndRef = useRef<HTMLDivElement>(null);
//     const inputRef = useRef<HTMLInputElement>(null);

//     useEffect(() => {
//         if (typeof window !== "undefined") {
//             const saved = sessionStorage.getItem("jobchat-history");
//             if (saved) setMessages(JSON.parse(saved));
//         }
//     }, []);

//     useEffect(() => {
//         chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
//         if (typeof window !== "undefined") {
//             sessionStorage.setItem("jobchat-history", JSON.stringify(messages));
//         }
//         if (!loading && isOpen) inputRef.current?.focus();
//     }, [messages, showTyping, loading, isOpen]);

//     const getCurrentTime = () => {
//         const now = new Date();
//         return now.toLocaleTimeString("vi-VN", {
//             hour: "2-digit",
//             minute: "2-digit",
//         });
//     };

//     const sendMessage = async () => {
//         if (!input.trim() || loading) return;
//         const userMessage = input.trim();
//         const time = getCurrentTime();

//         setInput("");
//         setMessages((prev) => [...prev, { type: "user", content: userMessage, time }]);
//         setLoading(true);
//         setShowTyping(true);

//         try {
//             const history = [
//                 ...messages.map((msg) => ({
//                     role: msg.type === "user" ? "user" : "assistant",
//                     text: msg.content,
//                 })),
//                 { role: "user", text: userMessage },
//             ];

//             const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai_chatbot`, {
//                 method: "POST",
//                 headers: { "Content-Type": "application/json" },
//                 body: JSON.stringify({ history }),
//             });

//             const data = await res.json();
//             setShowTyping(false);
//             setMessages((prev) => [
//                 ...prev,
//                 { type: "bot", content: data.reply, time: getCurrentTime() },
//             ]);
//         } catch (err) {
//             setShowTyping(false);
//             setMessages((prev) => [
//                 ...prev,
//                 {
//                     type: "bot",
//                     content: "⚠️ Không thể kết nối tới server.",
//                     time: getCurrentTime(),
//                 },
//             ]);
//         }
//         setLoading(false);
//     };

//     const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
//         if (e.key === "Enter" && !e.shiftKey) {
//             e.preventDefault();
//             sendMessage();
//         }
//     };

//     // Floating button style
//     const floatBtnStyle = {
//         position: "fixed" as const,
//         bottom: 84,
//         right: 23,
//         width: 64,
//         height: 64,
//         borderRadius: "50%",
//         background: "#87CEEB",
//         boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         zIndex: 9999,
//         cursor: "pointer",
//         border: "none"
//     };

//     // Modal style  khung chat bot 
//     const modalStyle = {
//         position: "fixed" as const,
//         bottom: 40, // thấp hơn cho thoáng
//         right: 40,
//         width: 480, // tăng chiều rộng
//         maxWidth: "98vw",
//         height: 600, // tăng chiều cao
//         background: "#fff",
//         borderRadius: 20,
//         boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
//         display: "flex",
//         flexDirection: "column" as const,
//         zIndex: 9999,
//         overflow: "hidden"
//     };

//     const headerStyle = {
//         background: "#00CCFF",
//         color: "#fff",
//         padding: "16px 20px 12px 20px",
//         display: "flex",
//         alignItems: "center",
//         gap: 12,
//         position: "relative" as const,
//         minHeight: 60
//     };
//     const closeBtnStyle = {
//         position: "absolute" as const,
//         right: 16,
//         top: 16,
//         background: "none",
//         border: "none",
//         color: "#fff",
//         fontSize: 22,
//         cursor: "pointer"
//     };
//     const iconStyle = {
//         width: 40,
//         height: 40,
//         borderRadius: "50%",
//         background: "#fff",
//         display: "flex",
//         alignItems: "center",
//         justifyContent: "center",
//         fontSize: 24,
//         color: "#00CCFF"
//     };
//     const bodyStyle = {
//         flex: 1,
//         background: "#fff",
//         padding: "16px 12px 8px 12px",
//         overflowY: "auto" as const,
//         display: "flex",
//         flexDirection: "column" as const
//     };
//     const inputBarStyle = {
//         borderTop: "1px solid #eee",
//         padding: "12px 16px",
//         display: "flex",
//         gap: 8,
//         background: "#fff"
//     };
//     const inputStyle = {
//         flex: 1,
//         border: "1px solid #ddd",
//         borderRadius: 12,
//         padding: "8px 12px"
//     };
//     const sendBtnStyle = {
//         background: "#00CCFF",
//         color: "#fff",
//         border: "none",
//         borderRadius: 12,
//         padding: "0 16px",
//         cursor: "pointer"
//     };
//     const msgUserStyle = {
//         background: "#00c4cc",
//         color: "#fff",
//         borderRadius: "16px 16px 0 16px",
//         alignSelf: "flex-end" as const,
//         margin: "4px 0",
//         padding: "8px 16px",
//         maxWidth: "70%",
//         fontSize: 16,
//         fontWeight: 500,
//         wordBreak: "break-word" as const
//     };
//     const msgBotStyle = {
//         background: "#f5f5f5",
//         color: "#333",
//         borderRadius: "16px 16px 16px 0",
//         alignSelf: "flex-start" as const,
//         margin: "4px 0",
//         padding: "8px 16px",
//         maxWidth: "90%",
//         gap: 4,
//     };

//     return (
//         <>
//             {/* Floating button */}
//             {/* ...existing code... */}
//             <button style={floatBtnStyle} onClick={() => setIsOpen(true)} title="Chat hỗ trợ">
//                 <span
//                     style={{
//                         display: "flex",
//                         alignItems: "center",
//                         justifyContent: "center",
//                         width: "100%",
//                         height: "100%",
//                     }}
//                 >
//                     <WechatOutlined style={{ fontSize: 36, color: "#fff" }} />
//                 </span>
//             </button>
//             {/* ...existing code... */}

//             {/* Modal chat */}
//             {isOpen && (
//                 <div style={modalStyle}>
//                     {/* Header */}
//                     <div style={headerStyle}>
//                         <div style={iconStyle}>
//                             {/* Đổi sang icon AliwangwangOutlined thay cho ảnh jobhub-logo */}
//                             <AliwangwangOutlined style={{ fontSize: 40, color: "#00CCFF" }} />
//                         </div>
//                         <div>
//                             <div style={{ fontWeight: 600, fontSize: 16 }}>Hỗ trợ trực tuyến</div>
//                             <div style={{ fontSize: 13, marginTop: 2 }}>Huyle sẵn sàng trợ giúp. Hãy để lại yêu cầu hoăcc câu hỏi của bạn tại đây!</div>
//                         </div>
//                         <button style={closeBtnStyle} onClick={() => setIsOpen(false)} aria-label="Đóng">
//                             <X size={22} />
//                         </button>
//                     </div>
//                     {/* Chat body nội dùng dc reply lại by chat*/}
//                     <div style={bodyStyle}>
//                         {messages.length === 0 && (
//                             <div style={{
//                                 display: "flex",
//                                 flexDirection: "column",
//                                 alignItems: "center",
//                                 justifyContent: "center",
//                                 color: "#888",
//                                 marginTop: 24,
//                                 marginBottom: 12
//                             }}>
//                                 <span style={{
//                                     display: "flex",
//                                     alignItems: "center",
//                                     justifyContent: "center",
//                                     // width: 154,
//                                     // height: 154,
//                                     marginBottom: 10,
//                                     boxShadow: "0 2px 8px rgba(0,196,204,0.10)"
//                                 }}>
//                                     {/* Đổi sang icon AliwangwangOutlined thay cho ảnh jobhub-logo */}
//                                     <AliwangwangOutlined style={{ fontSize: 250, color: "#00CCFF" }} />
//                                 </span>
//                                 <span style={{ fontSize: 16, fontWeight: 500, textAlign: "center", lineHeight: 1.5 }}>
//                                     👋 Xin chào! Bạn có thể hỏi về việc làm, mức lương, kỹ năng hoặc quy trình ứng tuyển.
//                                 </span>
//                             </div>
//                         )}
//                         {messages.map((message, index) => (
//                             <div
//                                 key={index}
//                                 style={{
//                                     ...(message.type === "user" ? msgUserStyle : msgBotStyle),
//                                     marginBottom: 10,
//                                     whiteSpace: "pre-line"
//                                 }}
//                             >
//                                 <ReactMarkdown
//                                     components={{
//                                         p: ({ node, ...props }) => <p style={{ margin: "0 0 8px 0" }} {...props} />,
//                                         strong: ({ node, ...props }) => <strong style={{ color: "#00c4cc" }} {...props} />,
//                                         span: ({ node, ...props }) => {
//                                             const text = String(props.children);
//                                             if (/chúc bạn thành công|chúc bạn may mắn|chúc bạn ứng tuyển thành công|chúc bạn sớm tìm được việc/i.test(text)) {
//                                                 return (
//                                                     <span
//                                                         style={{
//                                                             color: "#fff",
//                                                             background: "#00c4cc",
//                                                             padding: "8px 18px",
//                                                             borderRadius: 12,
//                                                             fontWeight: 900,
//                                                             fontSize: 20,
//                                                             display: "inline-block",
//                                                             marginTop: 12,
//                                                             marginBottom: 8,
//                                                             boxShadow: "0 4px 16px rgba(0,196,204,0.18)",
//                                                             letterSpacing: 1,
//                                                             textShadow: "0 2px 8px rgba(0,0,0,0.12)"
//                                                         }}
//                                                     >
//                                                         {text}
//                                                     </span>
//                                                 );
//                                             }
//                                             return <span {...props} />;
//                                         },
//                                     }}
//                                 >
//                                     {message.content}
//                                 </ReactMarkdown>
//                             </div>
//                         ))}
//                         {showTyping && (
//                             <div style={msgBotStyle}>
//                                 <span className="spinner-grow spinner-grow-sm text-secondary"></span>
//                                 <span className="spinner-grow spinner-grow-sm text-secondary"></span>
//                                 <span className="spinner-grow spinner-grow-sm text-secondary"></span>
//                             </div>
//                         )}
//                         <div ref={chatEndRef} />
//                     </div>
//                     {/* Input bar */}
//                     <div style={inputBarStyle}>
//                         <input
//                             ref={inputRef}
//                             type="text"
//                             value={input}
//                             onChange={(e) => setInput(e.target.value)}
//                             onKeyDown={handleKeyDown}
//                             placeholder="Nhập tin nhắn..."
//                             style={inputStyle}
//                             disabled={loading}
//                         />
//                         <button
//                             onClick={sendMessage}
//                             disabled={loading || !input.trim()}
//                             style={sendBtnStyle}
//                         >
//                             {loading ? "..." : <Send size={18} />}
//                         </button>
//                     </div>
//                 </div>
//             )}
//         </>
//     );
// }



"use client";

import { useState, useRef, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import { Send, X } from "lucide-react";
import { WechatOutlined, AliwangwangOutlined } from '@ant-design/icons';
import { Dispatch, SetStateAction } from "react";

interface JobChatBotProps {
    isOpen: boolean;
    setIsOpen: Dispatch<SetStateAction<boolean>>;
}

export default function JobChatBot({ isOpen, setIsOpen }: JobChatBotProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [input, setInput] = useState("");
    const [loading, setLoading] = useState(false);
    type Message = {
        type: "user" | "bot";
        content: string;
        time: string;
        imageUrl?: string;
        fileUrl?: string;
        fileName?: string;
    };
    const [messages, setMessages] = useState<Message[]>([]);
    const [showTyping, setShowTyping] = useState(false);
    const chatEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    // paste ảnh từ clipboard
    useEffect(() => {
        if (!isOpen) return;
        const handlePaste = (e: ClipboardEvent) => {
            if (e.clipboardData && e.clipboardData.files.length > 0) {
                const file = e.clipboardData.files[0];
                if (file.type.startsWith("image/")) {
                    setSelectedFile(file);
                }
            }
        };
        window.addEventListener("paste", handlePaste);
        return () => {
            window.removeEventListener("paste", handlePaste);
        };
    }, [isOpen]);

    useEffect(() => {
        if (typeof window !== "undefined") {
            const saved = sessionStorage.getItem("jobchat-history");
            if (saved) setMessages(JSON.parse(saved));
        }
    }, []);

    useEffect(() => {
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
        if (typeof window !== "undefined") {
            sessionStorage.setItem("jobchat-history", JSON.stringify(messages));
        }
        if (!loading && isOpen) inputRef.current?.focus();
    }, [messages, showTyping, loading, isOpen]);

    const getCurrentTime = () => {
        const now = new Date();
        return now.toLocaleTimeString("vi-VN", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const sendMessage = async () => {
        if (loading) return;
        const userMessage = input.trim();
        const time = getCurrentTime();

        setInput(""); // Xóa input ngay khi bấm gửi
        setLoading(true);
        setShowTyping(true);

        // Nếu có file ảnh hoặc PDF
        if (selectedFile) {
            // Hiển thị tin nhắn user ngay lập tức
            let imageUrl: string | undefined;
            let fileName: string | undefined;
            if (selectedFile.type.startsWith("image/")) {
                imageUrl = URL.createObjectURL(selectedFile);
            } else {
                fileName = selectedFile.name;
            }
            setMessages((prev) => [
                ...prev,
                { type: "user", content: userMessage, time, imageUrl, fileName },
            ]);
            setSelectedFile(null); // Xóa file đã chọn ngay khi gửi

            try {
                const formData = new FormData();
                formData.append("file", selectedFile); // key phải là 'file' cho Flask
                // Gửi history và input kèm theo
                const history = [
                    ...messages.map((msg) => ({
                        role: msg.type === "user" ? "user" : "assistant",
                        text: msg.content,
                    })),
                    userMessage ? { role: "user", text: userMessage } : null,
                ].filter(Boolean);
                formData.append("history", JSON.stringify(history));
                // Nếu muốn truyền job_position thì thêm formData.append("job_position", ...)

                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai_chatbot`, {
                    method: "POST",
                    body: formData,
                });
                if (!res.ok) {
                    const errorText = await res.text();
                    setMessages((prev) => [
                        ...prev,
                        { type: "bot", content: `⚠️ Upload thất bại (status: ${res.status}): ${errorText}`, time },
                    ]);
                    setShowTyping(false);
                    setLoading(false);
                    return;
                }
                const data = await res.json();
                setMessages((prev) => [
                    ...prev,
                    { type: "bot", content: data.reply, time: getCurrentTime() },
                ]);
                setShowTyping(false);
                setLoading(false);
            } catch (err: any) {
                setMessages((prev) => [
                    ...prev,
                    { type: "bot", content: `⚠️ Upload file thất bại: ${err?.message || err}`, time },
                ]);
                setShowTyping(false);
                setLoading(false);
            }
        } else if (userMessage) {
            setMessages((prev) => [...prev, { type: "user", content: userMessage, time }]);
            try {
                const history = [
                    ...messages.map((msg) => ({
                        role: msg.type === "user" ? "user" : "assistant",
                        text: msg.content,
                    })),
                    { role: "user", text: userMessage },
                ];
                const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/ai_chatbot`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ history }),
                });
                const data = await res.json();
                setShowTyping(false);
                setLoading(false);
                setMessages((prev) => [
                    ...prev,
                    { type: "bot", content: data.reply, time: getCurrentTime() },
                ]);
            } catch {
                setShowTyping(false);
                setLoading(false);
                setMessages((prev) => [
                    ...prev,
                    { type: "bot", content: "⚠️ Không thể kết nối tới server.", time: getCurrentTime() },
                ]);
            }
        } else {
            setShowTyping(false);
            setLoading(false);
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    // styles
    const floatBtnStyle = {
        position: "fixed" as const,
        bottom: 84,
        right: 23,
        width: 58,
        height: 58,
        borderRadius: "50%",
        background: "#87CEEB",
        boxShadow: "0 4px 16px rgba(0,0,0,0.15)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999,
        cursor: "pointer",
        border: "none"
    };

    const modalStyle = {
        position: "fixed" as const,
        bottom: 40,
        right: 40,
        width: 480,
        maxWidth: "98vw",
        height: 600,
        background: "#fff",
        borderRadius: 20,
        boxShadow: "0 8px 32px rgba(0,0,0,0.18)",
        display: "flex",
        flexDirection: "column" as const,
        zIndex: 9999,
        overflow: "hidden"
    };

    const headerStyle = {
        background: "#00CCFF",
        color: "#fff",
        padding: "16px 20px 12px 20px",
        display: "flex",
        alignItems: "center",
        gap: 12,
        position: "relative" as const,
        minHeight: 60
    };
    const closeBtnStyle = {
        position: "absolute" as const,
        right: 16,
        top: 16,
        background: "none",
        border: "none",
        color: "#fff",
        fontSize: 22,
        cursor: "pointer"
    };
    const iconStyle = {
        width: 40,
        height: 40,
        borderRadius: "50%",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 24,
        color: "#00CCFF"
    };
    const bodyStyle = {
        flex: 1,
        background: "#fff",
        padding: "16px 12px 8px 12px",
        overflowY: "auto" as const,
        display: "flex",
        flexDirection: "column" as const
    };
    const sendBtnStyle = {
        background: "#00CCFF",
        color: "#fff",
        border: "none",
        borderRadius: 12,
        padding: "22px 27px",
        cursor: "pointer"
    };
    const msgUserStyle = {
        background: "#00c4cc",
        color: "#fff",
        borderRadius: "16px 16px 0 16px",
        alignSelf: "flex-end" as const,
        padding: "8px 16px",
        maxWidth: "70%",
        fontSize: 16,
        fontWeight: 500,
        wordBreak: "break-word" as const
    };
    const msgBotStyle = {
        background: "#f5f5f5",
        color: "#333",
        borderRadius: "16px 16px 16px 0",
        alignSelf: "flex-start" as const,
        padding: "8px 16px",
        maxWidth: "90%",
    };

    return (
        <>
            {!isOpen && (
                <button
                    style={floatBtnStyle}
                    onClick={() => setIsOpen(true)}
                    title="Chat hỗ trợ"
                >
                    <WechatOutlined style={{ fontSize: 36, color: "#fff" }} />
                </button>
            )}

            {isOpen && (
                <div style={modalStyle}>
                    <div style={headerStyle}>
                        <div style={iconStyle}>
                            <AliwangwangOutlined style={{ fontSize: 40, color: "#00CCFF" }} />
                        </div>
                        <div>
                            <div style={{ fontWeight: 600, fontSize: 16 }}>Hỗ trợ trực tuyến</div>
                            <div style={{ fontSize: 13, marginTop: 2 }}>
                                Huyle sẵn sàng trợ giúp. Hãy để lại yêu cầu hoặc câu hỏi của bạn tại đây!
                            </div>
                        </div>
                        <button style={closeBtnStyle} onClick={() => setIsOpen(false)} aria-label="Đóng">
                            <X size={22} />
                        </button>
                    </div>

                    <div style={bodyStyle}>
                        {messages.map((message, index) => (
                            <div
                                key={index}
                                style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: message.type === "user" ? "flex-end" : "flex-start",
                                    marginBottom: 12,
                                    gap: 4,
                                }}
                            >
                                {/* Ảnh */}
                                {message.imageUrl && (
                                    <img
                                        src={message.imageUrl}
                                        alt="preview"
                                        style={{
                                            maxWidth: "240px",
                                            maxHeight: "240px",
                                            borderRadius: 12,
                                            boxShadow: "0 2px 8px rgba(0,196,204,0.10)"
                                        }}
                                    />
                                )}
                                {/* File PDF */}
                                {message.fileName && (
                                    <div style={{
                                        display: "flex",
                                        alignItems: "center",
                                        background: "#f0f0f0",
                                        borderRadius: 8,
                                        padding: "6px 10px",
                                        fontSize: 14
                                    }}>
                                        📄 {message.fileName}
                                    </div>
                                )}
                                {/* Text */}
                                {message.content && (
                                    <div style={message.type === "user" ? msgUserStyle : msgBotStyle}>
                                        <ReactMarkdown>{message.content}</ReactMarkdown>
                                    </div>
                                )}
                            </div>
                        ))}

                        {showTyping && (
                            <div style={msgBotStyle}>
                                <span className="spinner-grow spinner-grow-sm text-secondary"></span>
                                <span className="spinner-grow spinner-grow-sm text-secondary"></span>
                                <span className="spinner-grow spinner-grow-sm text-secondary"></span>
                            </div>
                        )}
                        <div ref={chatEndRef} />
                    </div>

                    {/* input bar */}
                    <div
                        style={{
                            width: "100%",
                            background: "#fff",
                            borderTop: "1px solid #eee",
                            padding: "12px 16px",
                            display: "flex",
                            alignItems: "center",
                            gap: 8,
                        }}
                    >
                        <label htmlFor="chatbot-file-upload" style={{
                            cursor: "pointer",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            width: 40,
                            height: 40,
                            borderRadius: "50%",
                            background: "#f5f5f5",
                        }}>
                            <input
                                id="chatbot-file-upload"
                                type="file"
                                accept="image/*,application/pdf"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                    if (e.target.files && e.target.files[0]) {
                                        setSelectedFile(e.target.files[0]);
                                    }
                                }}
                            />
                            <img src="/assets/imgs/brands/brand-1.png" alt="Đính kèm" style={{ width: 24, height: 24 }} />
                        </label>

                        <div style={{
                            flex: 1,
                            display: "flex",
                            flexDirection: "column",
                            border: "1px solid #ddd",
                            borderRadius: 12,
                            padding: "18px 8px",
                            gap: 6,
                        }}>
                            {selectedFile && (
                                <div style={{
                                    display: "flex",
                                    alignItems: "center",
                                    background: "#f0f0f0",
                                    borderRadius: 8,
                                    padding: "2px 6px",
                                    maxWidth: "100%",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                }}>
                                    <span style={{ fontSize: 13, marginRight: 4 }}>{selectedFile.name}</span>
                                    <button onClick={() => setSelectedFile(null)} style={{
                                        background: "none",
                                        border: "none",
                                        color: "#666",
                                        fontSize: 14,
                                        cursor: "pointer",
                                    }}>×</button>
                                </div>
                            )}
                            <textarea
                                ref={inputRef as any}
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyDown={handleKeyDown as any}
                                placeholder="Nhập tin nhắn..."
                                style={{
                                    flex: 1,
                                    border: "none",
                                    outline: "none",
                                    fontSize: 14,
                                    minWidth: 0,
                                    resize: "none",
                                    minHeight: 36,
                                    maxHeight: 120,
                                    lineHeight: 1.5,
                                    padding: 0,
                                }}
                                disabled={loading}
                                rows={2}
                            />
                        </div>

                        <button
                            onClick={sendMessage}
                            disabled={loading || (!input.trim() && !selectedFile)}
                            style={{
                                ...sendBtnStyle,
                                boxShadow: "0 2px 8px rgba(0,196,204,0.10)",
                                marginLeft: 4,
                            }}
                        >
                            {loading ? "..." : <Send size={18} />}
                        </button>
                    </div>
                </div>
            )}
        </>
    );
}
