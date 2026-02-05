import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgInfoCircle = (
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
      d="M12 22c5.5 0 10-4.5 10-10S17.5 2 12 2 2 6.5 2 12s4.5 10 10 10M12 8v5"
    />
    <path
      stroke="#8D95A5"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M11.996 16h.01"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgInfoCircle);
export default ForwardRef;
