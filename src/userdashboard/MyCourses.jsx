import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaStar, FaRegClock } from "react-icons/fa";
import { MdGroup } from "react-icons/md";
import cardImage from "../assets/image/card.jpg";
import config from "../pages/config";

const MyCourses = () => {
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEnrolledCourses = async () => {
      try {
        setLoading(true);
        // ✅ Example: userId fetch from localStorage or auth context
        const userId = localStorage.getItem("userId");
        const res = await fetch(`${config.BASE_URL}courses/enrolled/${userId}`);
        const data = await res.json();

        if (data.statusCode === 200) {
          setEnrolledCourses(data.result);
        } else {
          setEnrolledCourses([]);
        }
      } catch (error) {
        console.error("Error fetching enrolled courses:", error);
        setEnrolledCourses([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEnrolledCourses();
  }, []);

  const handleCourseClick = (course) => {
    navigate("/course-details", { state: { course } });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600">Loading your courses...</p>
      </div>
    );
  }

  if (enrolledCourses.length === 0) {
    return (
      <div className="flex items-center justify-center h-screen ">
        <p className="text-gray-600 text-lg bg-yellow-100 font-sans h-100 w-100 flex justify-center items-center rounded shadow-2xl">You haven’t enrolled in any courses yet.</p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10 space-y-6">
      <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-6">My Courses</h1>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {enrolledCourses.map((course) => (
          <div
            key={course._id}
            className="rounded-xl shadow-md hover:shadow-lg transition overflow-hidden flex flex-col cursor-pointer"
            onClick={() => handleCourseClick(course)}
          >
            {/* Image */}
            <div className="relative">
              <img
                src={course.image || cardImage}
                alt={course.title}
                className="w-full h-36 sm:h-44 object-cover"
              />
              <span className="absolute top-2 left-2 bg-yellow-400 text-xs px-2 py-1 rounded">
                {course.mode === "Recorded" ? "Self-Paced" : "Live Course"}
              </span>
              <span className="absolute top-2 right-2 bg-black text-white text-xs px-2 py-1 rounded">
                {course.level || "Beginner"}
              </span>
            </div>

            {/* Content */}
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="mt-3 px-3">
                  <h3 className="text-lg text-gray-900 leading-tight">{course.title}</h3>
                  <p className="text-sm text-gray-600">by {course.instructor || "Unknown"}</p>
                </div>
                <p className="text-gray-700 text-sm mt-2 px-3 leading-snug line-clamp-2">
                  {course.description}
                </p>
                <div className="flex gap-4 flex-wrap items-center text-xs text-gray-500 mt-2 px-3">
                  <span className="flex items-center gap-1">
                    <FaRegClock /> {course.duration || "N/A"}
                  </span>
                  <span className="flex items-center gap-1">
                    <MdGroup /> {course.studentsCount || 0}
                  </span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" /> {course.rating || 0}
                  </span>
                </div>
              </div>

              {/* Price */}
              <div className="mt-4 px-3 pb-4 flex items-center justify-between">
                <p className="text-gray-900 font-medium">₹{course.price}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MyCourses;
