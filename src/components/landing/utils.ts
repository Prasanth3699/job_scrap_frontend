"use client";

import gsap from "gsap";

export const animateNavLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
  const link = e.currentTarget;

  // Clear any existing underline
  const existingUnderline = link.querySelector(".nav-underline");
  if (existingUnderline) existingUnderline.remove();

  const underline = document.createElement("span");
  underline.className =
    "nav-underline absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-purple-400 to-blue-500 origin-left";
  underline.style.transform = "scaleX(0)";
  link.appendChild(underline);

  gsap.to(underline, {
    scaleX: 1,
    duration: 0.3,
    ease: "power2.out",
    onComplete: () => {
      setTimeout(() => {
        gsap.to(underline, {
          opacity: 0,
          duration: 0.2,
          onComplete: () => {
            underline.remove();
          },
        });
      }, 300);
    },
  });
};
