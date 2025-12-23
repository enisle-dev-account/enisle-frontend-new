import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgDashboard = (
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
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M5 10h2q3 0 3-3V5q0-3-3-3H5Q2 2 2 5v2q0 3 3 3M17 10h2q3 0 3-3V5q0-3-3-3h-2q-3 0-3 3v2q0 3 3 3M17 22h2q3 0 3-3v-2q0-3-3-3h-2q-3 0-3 3v2q0 3 3 3M5 22h2q3 0 3-3v-2q0-3-3-3H5q-3 0-3 3v2q0 3 3 3"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgDashboard);
export default ForwardRef;
