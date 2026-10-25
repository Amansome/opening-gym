import { act, createElement, useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import type { CourseProgress, StreakInfo } from "./api";
import { course, learnLines, setup } from "./test-utils";
import { useCourseProgress, useStreak } from "./useProgress";

(globalThis as { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT = true;

const italian = course("italian-game");
const london = course("london-system");

describe("React hooks", () => {
  let host: HTMLDivElement;
  let root: Root;
  beforeEach(() => {
    host = document.createElement("div");
    document.body.appendChild(host);
    root = createRoot(host);
  });
  afterEach(() => {
    act(() => root.unmount());
    host.remove();
  });

  const flush = () => act(async () => void (await new Promise((r) => setTimeout(r, 5))));

  it("useCourseProgress loads, then refreshes after writes", async () => {
    const { p } = setup();
    const seen: (CourseProgress | undefined)[] = [];
    function Probe() {
      const cp = useCourseProgress(italian, p);
      seen.push(cp);
      return createElement("span", null, cp ? String(cp.learnedCount) : "…");
    }
    act(() => root.render(createElement(Probe)));
    expect(host.textContent).toBe("…");
    await flush();
    expect(host.textContent).toBe("0");
    await act(async () => void (await learnLines(p, italian, 2)));
    await flush();
    expect(host.textContent).toBe("2");
  });

  it("useCourseProgress follows the course prop and tolerates undefined", async () => {
    const { p } = setup();
    await learnLines(p, london, 1);
    function Probe({ c }: { c: typeof italian | undefined }) {
      const cp = useCourseProgress(c, p);
      return createElement("span", null, cp ? `${cp.courseId}:${cp.learnedCount}` : "none");
    }
    act(() => root.render(createElement(Probe, { c: undefined })));
    await flush();
    expect(host.textContent).toBe("none");
    act(() => root.render(createElement(Probe, { c: london })));
    await flush();
    expect(host.textContent).toBe("london-system:1");
    act(() => root.render(createElement(Probe, { c: italian })));
    await flush();
    expect(host.textContent).toBe("italian-game:0");
  });

  it("useStreak refreshes when a line is completed and unsubscribes on unmount", async () => {
    const { p } = setup();
    const latest = { current: undefined as StreakInfo | undefined };
    function Probe() {
      const streak = useStreak(p);
      useEffect(() => {
        latest.current = streak;
      });
      return null;
    }
    act(() => root.render(createElement(Probe)));
    await flush();
    expect(latest.current).toEqual({ current: 0, best: 0, todayDone: false });
    await act(async () => void (await learnLines(p, italian, 1)));
    await flush();
    expect(latest.current).toEqual({ current: 1, best: 1, todayDone: true });
    act(() => root.unmount());
    root = createRoot(host); // so afterEach can unmount cleanly
    await learnLines(p, italian, 1); // must not throw "state update on unmounted"
  });
});
