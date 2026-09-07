"use client";

import { useEffect } from "react";

const revealSelector = "[data-reveal]";
const viewportAnimationSelector = "[data-viewport-animate]";
const managedSelector = `${revealSelector}, ${viewportAnimationSelector}`;

export function ScrollRevealManager() {
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    if (prefersReducedMotion || !("IntersectionObserver" in window)) {
      document
        .querySelectorAll<HTMLElement>(revealSelector)
        .forEach((element) => element.classList.add("is-revealed"));
      document
        .querySelectorAll<HTMLElement>(viewportAnimationSelector)
        .forEach((element) => element.classList.add("is-in-viewport"));
      return;
    }

    document.documentElement.classList.add("reveal-enabled");
    const observedElements = new Set<HTMLElement>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const element = entry.target as HTMLElement;

          if (element.matches(revealSelector)) {
            element.classList.toggle("is-revealed", entry.isIntersecting);
          }

          if (element.matches(viewportAnimationSelector)) {
            element.classList.toggle("is-in-viewport", entry.isIntersecting);

            if (
              element instanceof HTMLVideoElement &&
              element.hasAttribute("data-autoplay-video")
            ) {
              if (entry.isIntersecting && !document.hidden) {
                void element.play().catch(() => undefined);
              } else {
                element.pause();
              }
            }
          }
        });
      },
      { rootMargin: "0px 0px -8% 0px", threshold: 0.1 },
    );

    const registerElement = (element: HTMLElement) => {
      if (observedElements.has(element)) return;

      observedElements.add(element);
      observer.observe(element);
    };

    const unregisterElement = (element: HTMLElement) => {
      if (!observedElements.has(element)) return;

      observer.unobserve(element);
      observedElements.delete(element);
    };

    const findManagedElements = (node: Node) => {
      if (!(node instanceof HTMLElement)) return [];

      const elements: HTMLElement[] = [];

      if (node.matches(managedSelector)) {
        elements.push(node);
      }

      elements.push(
        ...Array.from(node.querySelectorAll<HTMLElement>(managedSelector)),
      );

      return elements;
    };

    const initialElements = Array.from(
      document.querySelectorAll<HTMLElement>(managedSelector),
    );
    initialElements.forEach(registerElement);

    const mutationObserver = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          findManagedElements(node).forEach(registerElement);
        });

        record.removedNodes.forEach((node) => {
          findManagedElements(node).forEach(unregisterElement);
        });
      });
    });

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    });

    let secondFrame = 0;
    const firstFrame = window.requestAnimationFrame(() => {
      secondFrame = window.requestAnimationFrame(() => {
        initialElements.forEach((element) => {
          const bounds = element.getBoundingClientRect();
          const isInViewport =
            bounds.top < window.innerHeight * 0.94 && bounds.bottom > 0;

          if (isInViewport && element.matches(revealSelector)) {
            element.classList.add("is-revealed");
          }

          if (isInViewport && element.matches(viewportAnimationSelector)) {
            element.classList.add("is-in-viewport");
          }
        });
      });
    });

    return () => {
      window.cancelAnimationFrame(firstFrame);
      window.cancelAnimationFrame(secondFrame);
      mutationObserver.disconnect();
      observer.disconnect();
      observedElements.clear();
      document.documentElement.classList.remove("reveal-enabled");
    };
  }, []);

  return null;
}
