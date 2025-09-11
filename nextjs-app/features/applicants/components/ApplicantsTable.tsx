/* eslint-disable @next/next/no-img-element */
"use client";

import { useApplicants } from "../hooks/useApplicants";
// import ApplicantDetailModal from "@/features/applicants/components/ApplicantDetailModal";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export default function ApplicantsTable() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // UI mặc định page = 1
  const currentPage = parseInt(searchParams.get("page") ?? "1", 10);
  const pageSize = 5;

  // Truyền (currentPage - 1) vào API vì backend zero-based
  const { applications, loading, totalPages, handleDeleteApplicant } =
    useApplicants(pageSize, currentPage - 1);

  // const [selectedApplicantId, setSelectedApplicantId] = useState<number | null>(
  //   null
  // );
  //   // Khi lần đầu vào, nếu chưa có ?page thì set = 1
  // useEffect(() => {
  //   if (!searchParams.get("page")) {
  //     router.replace("?page=1");
  //   }
  // }, [searchParams, router]);

  if (loading) return <p>Loading...</p>;
  if (!applications || applications.length === 0)
    return <p>No applicants found.</p>;

  const setPage = (newPage: number) => {
    const params = new URLSearchParams(window.location.search);
    params.set("page", newPage.toString());
    router.push(`?${params.toString()}`);
  };

  return (
    <div className="row display-list">
      {applications.map((app) => (
        <div key={app.id} className="col-xl-12 col-12">
          <div className="card-grid-2 hover-up">
            <span className="flash" />
            <div className="row">
              <div className="col-lg-6 col-md-6 col-sm-12">
                <div className="card-grid-2-image-left">
                  <div className="image-box">
                    <img src="assets/imgs/brands/brand-5.png" alt="jobBox" />
                  </div>
                  <div className="right-info">
                    <Link href="#">
                      <span className="name-job">{app.candidateId}</span>
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
                <Link href="/job-details">
                  <span>{app.jobTitle}</span>
                </Link>
              </h4>
              <div className="mt-5">
                <span className="card-briefcase">Fulltime</span>
                <span className="card-time">
                  <span>4</span>
                  <span> mins ago</span>
                </span>
              </div>
              <p className="font-sm color-text-paragraph mt-10">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                Recusandae architecto eveniet, dolor quo repellendus pariatur
              </p>
              <div className="card-2-bottom mt-20">
                <div className="row">
                  <div className="col-lg-7 col-7">
                    <span className="card-text-price">$500</span>
                    <span className="text-muted">/Hour</span>
                  </div>
                  <div className="col-lg-5 col-5 text-end">
                    <button
                      style={{ marginRight: "5px" }}
                      className="btn btn-danger"
                      data-bs-toggle="modal"
                      data-bs-target="#ModalApplyJobForm"
                      onClick={() => handleDeleteApplicant(app.id)}
                    >
                      Delete
                    </button>
                    {/* <button
                      className="btn btn-apply-now"
                      onClick={() => setSelectedApplicantId(app.id)}
                    >
                      Xem chi tiết
                    </button> */}
                    <button
                      className="btn btn-apply-now"
                      onClick={() => router.push(`/applicants/${app.id}`)}
                    >
                      Xem chi tiết
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Pagination */}
      <div className="pagination">
        <button
          onClick={() => setPage(currentPage - 1)}
          disabled={currentPage === 1}
        >
          Prev
        </button>

        {[...Array(totalPages)].map((_, idx) => (
          <button
            key={idx}
            className={currentPage === idx + 1 ? "active" : ""}
            onClick={() => setPage(idx + 1)}
          >
            {idx + 1}
          </button>
        ))}

        <button
          onClick={() => setPage(currentPage + 1)}
          disabled={currentPage === totalPages}
        >
          Next
        </button>
      </div>

      {/* {selectedApplicantId && (
        <ApplicantDetailModal
          applicantId={selectedApplicantId}
          onClose={() => setSelectedApplicantId(null)}
        />
      )} */}
    </div>
  );
}
