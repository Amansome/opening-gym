// PLACEHOLDER: the trainer agent replaces this file. Contract: named export, these props.
import type { Course, Mode } from "../../lib/types";

export interface CoursePlayerProps {
  course: Course;
  initialMode?: Mode; // defaults to "learn"
}

export function CoursePlayer({ course }: CoursePlayerProps) {
  return <div data-placeholder="course-player">Trainer for {course.title} coming soon.</div>;
}
