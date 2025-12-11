import { useEffect, useRef } from "react";

const StickyScrollbarWrapper = ({ children }) => {
  // allow you to directly access and manipulate the underlying DOM elements inside your React component.
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  const scrollbarRef = useRef(null);
  const scrollbarInnerRef = useRef(null);

  useEffect(() => {
    // .current is the property on the ref object that holds the actual DOM node once the component has rendered.
    const container = containerRef.current;
    const content = contentRef.current;
    const scrollbar = scrollbarRef.current;
    const scrollbarInner = scrollbarInnerRef.current;

    // any of these important elements don’t exist or aren’t found, then stop running the effect early.
    if (!container || !content || !scrollbar || !scrollbarInner) return;

    // Try to find the <table> inside the content div
    const table = content.querySelector("table");

    // moves the table (the content) left or right when you scroll the fake scrollbar.
    const syncScroll = () => {
      content.style.transform = `translateX(-${scrollbar.scrollLeft}px)`;
    };

    // sets the width of the fake scrollbar’s inner part to the full scrollable width of the content
    const updateScrollbar = () => {
      const scrollWidth = content.scrollWidth || table?.scrollWidth || 0;
      scrollbarInner.style.width = `${scrollWidth}px`;
      // sets the width of the scrollbar itself to match the visible container’s width.
      scrollbar.style.width = `${container.offsetWidth}px`;
    };

    // when the fake scrollbar is scrolled, it calls syncScroll to move the content accordingly.
    scrollbar.addEventListener("scroll", syncScroll);

    // allows horizontal scrolling with a vertical mouse wheel + shift.
    const onWheel = (e) => {
      if (e.shiftKey) {
        e.preventDefault();
        scrollbar.scrollLeft += e.deltaY;
      }
    };
    // adds the eventListener to the wheel of the mouse and make it passively false
    container.addEventListener("wheel", onWheel, { passive: false });

    // Observe changes to the container and table (for header resizing)
    const resizeObserver = new ResizeObserver(updateScrollbar);
    resizeObserver.observe(container);
    if (table) {
      resizeObserver.observe(table);
    }

    // Initial update
    updateScrollbar();
    // cleans up all the event listeners and observers set up
    return () => {
      scrollbar.removeEventListener("scroll", syncScroll);
      container.removeEventListener("wheel", onWheel);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div className="relative w-full">
      <div ref={containerRef} className="w-full overflow-clip">
        <div ref={contentRef} style={{ transition: "transform 0.1s ease-out" }}>
          {children}
        </div>
      </div>
      <div
        ref={scrollbarRef}
        className="sticky-scrollbar"
        style={{
          display: "block",
          overflowX: "auto",
          position: "sticky",
          bottom: 0,
          width: "100%",
          zIndex: 1,
        }}
      >
        <div
          ref={scrollbarInnerRef}
          style={{ height: 1, pointerEvents: "none" }}
        ></div>
      </div>
    </div>
  );
};

export default StickyScrollbarWrapper;
