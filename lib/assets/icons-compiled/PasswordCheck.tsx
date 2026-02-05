import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgPasswordCheck = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 24 24"
    ref={ref}
    {...props}
  >
    <path
      stroke="#8D95A5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M11.02 19.5H7.5c-.62 0-1.17-.02-1.66-.09-2.63-.29-3.34-1.53-3.34-4.91v-5c0-3.38.71-4.62 3.34-4.91.49-.07 1.04-.09 1.66-.09h3.46M15.02 4.5h1.48c.62 0 1.17.02 1.66.09 2.63.29 3.34 1.53 3.34 4.91v5c0 3.38-.71 4.62-3.34 4.91-.49.07-1.04.09-1.66.09h-1.48M15 2v20"
    />
    <path
      stroke="#8D95A5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.096 12h.01M7.096 12h.01"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgPasswordCheck);
export default ForwardRef;
