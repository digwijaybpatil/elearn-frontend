import React, { useState, useMemo } from 'react';

const CourseCard = ({ course }) => {
  const [showLessons, setShowLessons] = useState(false);

  const cardColorClass = useMemo(() => {
    const colorClasses = [
      "bg-primary",
      "bg-secondary",
      "bg-success",
      "bg-danger",
      "bg-warning",
      "bg-info",
    ];
    return colorClasses[Math.floor(Math.random() * colorClasses.length)];
  }, [course.courseId]);

  const toggleLessons = () => {
    setShowLessons(!showLessons);
  };

  let lessons = [];
  try {
    lessons = course.lessons;
  } catch (error) {
    console.error("Invalid lessons JSON", error);
  }

  return (
    <div className={`card mb-4 shadow-sm ${cardColorClass} text-white`}>
      <div className="card-body">
        <h5 className="card-title">{course.courseName}</h5>
        <h6 className="card-subtitle mb-2">{course.instructorName}</h6>
        <button className="btn btn-light" onClick={toggleLessons}>
          {showLessons ? "Hide Lessons" : "Show Lessons"}
        </button>
        {showLessons && (
          <ul className="list-group list-group-flush mt-3">
            {lessons.map((lesson, index) => (
              <li key={index} className="list-group-item">
                {lesson}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default CourseCard;
