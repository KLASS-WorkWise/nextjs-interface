// // components/applicant/ApplicantTracking.tsx
// "use client";

// import { useEffect, useState } from "react";
// import getApplicantTracking, subscribeApplicant  from "@/features/applicants/services/applicant.service";
// import { Timeline } from "./Timeline";

// export default function ApplicantTracking({ id }: { id: number }) {
//   const [tracking, setTracking] = useState<any>(null);

//   useEffect(() => {
//     // load initial data
//     getApplicantTracking(id).then(setTracking);

//     // subscribe realtime
//     const unsubscribe = subscribeApplicant(id, (data) => {
//       setTracking((prev: any) => ({
//         ...prev,
//         detail: data,
//       }));
//     });

//     return () => unsubscribe();
//   }, [id]);

//   if (!tracking) return <div>Đang tải dữ liệu...</div>;

//   const { detail, history, timeline } = tracking;

//   return (
//     <div className="grid gap-6">
//       {/* Thông tin đơn apply */}
//       <Card>
//         <CardContent className="p-4">
//           <h2 className="text-xl font-bold mb-2">{detail.jobTitle}</h2>
//           <p className="text-sm text-gray-500">{detail.companyName}</p>
//           <div className="flex gap-2 mt-2">
//             <Badge>{detail.status}</Badge>
//             <Badge variant="outline">
//               {detail.skillMatchPercent}% kỹ năng phù hợp
//             </Badge>
//           </div>
//           <p className="text-sm mt-2">{detail.minExperience}</p>
//         </CardContent>
//       </Card>

//       {/* Timeline */}
//       <Timeline steps={timeline} />

//       {/* Lịch sử thay đổi */}
//       <Card>
//         <CardContent className="p-4">
//           <h3 className="text-lg font-semibold mb-2">Lịch sử thay đổi</h3>
//           <ul className="space-y-2">
//             {history.map((h: any, idx: number) => (
//               <li key={idx} className="text-sm">
//                 <span className="font-medium">{h.status}</span> - {h.note}  
//                 <span className="text-gray-500 ml-2">
//                   ({new Date(h.changedAt).toLocaleString()})
//                 </span>
//                 <br />
//                 <span className="text-xs text-gray-400">
//                   Thay đổi bởi: {h.changedBy}
//                 </span>
//               </li>
//             ))}
//           </ul>
//         </CardContent>
//       </Card>
//     </div>
//   );
// }
