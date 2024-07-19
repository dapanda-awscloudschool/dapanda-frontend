import React from "react";

export const Heart = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <svg
    aria-hidden="true"
    focusable="false"
    height="24"
    role="presentation"
    viewBox="0 -5.5 64 64"
    width="24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <title>Heart</title>
    <desc>Created with Sketch.</desc>
    <defs />
    <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
      <path
        d="M32,8.7 C27.1,-2.2 1,-3 1,16.4 C1,31.6 26.4,51 32,51 C37.6,51 63,31.6 63,16.4 C63,-5.2 29.1,-3.7 29.1,19.3"
        id="Heart"
        stroke="currentColor"
        strokeWidth="2"
      />
    </g>
  </svg>
);
