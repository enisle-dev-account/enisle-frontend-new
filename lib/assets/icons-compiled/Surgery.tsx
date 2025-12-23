import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSurgery = (
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
      stroke="#fff"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M14 5h6M14 8h3M21 11.5c0 5.25-4.25 9.5-9.5 9.5S2 16.75 2 11.5 6.25 2 11.5 2M22 22l-2-2"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSurgery);
export default ForwardRef;
