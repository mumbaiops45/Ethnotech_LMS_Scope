// "use client";

// import React from "react";
// import { useParams } from "next/navigation";
// import { useMyProgress } from "../../../../hooks/useProgress";

// const Page = () => {

//   const params = useParams();
//   // const courseId = params?.courseId;
//   const courseId = params?.courseId?.toString();
// console.log("PARAMS:", params);
// console.log("COURSE ID:", courseId);
//   const {
//     myProgress,
//     loading,
//     error,
//     refetch
//   } = useMyProgress(courseId);

//   if (loading) {
//     return <p>Loading...</p>;
//   }

//   if (error) {
//     return <p>Error: {error}</p>;
//   }

//   console.log("UI DATA:", myProgress);


//   if (!myProgress) {
//     return <p>No Progress Found</p>;
//   }

//   return (
//     <div className="p-5">

//       <h2 className="text-2xl font-bold mb-4">
//         My Progress
//       </h2>

//       <pre className="bg-gray-100 p-4 rounded">
//         {JSON.stringify(myProgress, null, 2)}
//       </pre>

//       <button
//         onClick={refetch}
//         className="mt-4 px-4 py-2 bg-[var(--primery)] text-white rounded"
//       >
//         Refresh
//       </button>

//     </div>
//   );
// };

// export default Page;


export default function Page() {
  return <div>Select a course</div>;
}