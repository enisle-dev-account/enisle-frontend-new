import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgHeartRate = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 59 49"
    ref={ref}
    {...props}
  >
    <path
      fill="#FFD3D9"
      d="m3 21.348-1-6.5v-2l1.5-4 2-3 2-2.5 3-1.5 3.5-1h4.5l3 .5 3.5 1.5 3 1.5 2.5-1.5 2.5-1 2.5-1 4-.5 3 .5 3 1 2.5 1.5 2.5 2.5 2 2.5 1 3 1 4.5.5 4-.5 3.5h-11l-3.5-6-4.5 8.5-4.5-12-5.5 22-6-14.5-4 8.5H7l-1.5-2.5z"
    />
    <path
      stroke="#FF697F"
      d="M48 32.847c-1.833 2.667-8.2 8.7-19 15.5-9-4.167-27-16.8-27-34 1.167-7.5 7.2-20 26-10 3.667-2.666 12.8-6.599 20-.999s7.333 15.333 6.5 19.5"
    />
    <path
      stroke="#FF697F"
      d="M0 29.848h15.5l4-8.5 6 15 5.5-22.5 4.5 12.5 4.5-9 3 6h15.5"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgHeartRate);
export default ForwardRef;
