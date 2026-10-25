// "Where does this position appear in the courses?" — an EPD-keyed index over every course tree
// (built-in and custom). Used by the analysis board for opening names and "in your courses" links.
import { allCourses, onCustomCoursesChange } from "../courses";
import type { Course, MoveNode } from "../types";

/** First four FEN fields: placement, side to move, castling, en passant. Ignores the move counters. */
export function epd(fen: string): string {
  return fen.trim().split(/\s+/).slice(0, 4).join(" ");
}

export interface CourseHit {
  courseId: string;
  courseTitle: string;
  /** Moves the course continues with from this position (empty at the end of a line). */
  next: MoveNode[];
  /** The course move the user is meant to find here, if the next move is a trained one. */
  trained?: MoveNode;
}

interface Index {
  names: Map<string, string>;
  hits: Map<string, CourseHit[]>;
}

const START_EPD = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq -";

function build(courses: Course[]): Index {
  const names = new Map<string, string>();
  const hits = new Map<string, CourseHit[]>();

  const add = (key: string, course: Course, next: MoveNode[]) => {
    let list = hits.get(key);
    if (!list) hits.set(key, (list = []));
    if (list.some((h) => h.courseId === course.id)) return; // transposition inside one course
    list.push({ courseId: course.id, courseTitle: course.title, next, trained: next.find((n) => n.trained) });
  };

  for (const course of courses) {
    add(START_EPD, course, course.tree);
    const walk = (nodes: MoveNode[]) => {
      for (const node of nodes) {
        const key = epd(node.fen);
        if (node.opening && !names.has(key)) names.set(key, node.opening);
        add(key, course, node.children);
        walk(node.children);
      }
    };
    walk(course.tree);
  }
  return { names, hits };
}

let cache: Index | null = null;
let hooked = false;

function index(): Index {
  if (!hooked) {
    hooked = true;
    onCustomCoursesChange(() => {
      cache = null;
    });
  }
  return (cache ??= build(allCourses()));
}

/** Opening name for exactly this position, if any course (or the shared opening data) names it. */
export function openingName(fen: string): string | undefined {
  return index().names.get(epd(fen));
}

/** Courses whose tree contains this position, with what they play next. Sorted by title. */
export function coursesAt(fen: string): CourseHit[] {
  const list = index().hits.get(epd(fen)) ?? [];
  return [...list].sort((a, b) => a.courseTitle.localeCompare(b.courseTitle));
}

/** Test hook: rebuild from an explicit course list. */
export function indexCourses(courses: Course[]): { openingName(fen: string): string | undefined; coursesAt(fen: string): CourseHit[] } {
  const idx = build(courses);
  return {
    openingName: (fen) => idx.names.get(epd(fen)),
    coursesAt: (fen) => idx.hits.get(epd(fen)) ?? [],
  };
}
