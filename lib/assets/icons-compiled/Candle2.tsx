import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgCandle2 = (
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
      strokeMiterlimit={10}
      strokeWidth={1.5}
      d="M22 17.5h-7M5 17.5H2M22 6.5h-3M9 6.5H2M7 14.5h6c1.1 0 2 .5 2 2v2c0 1.5-.9 2-2 2H7c-1.1 0-2-.5-2-2v-2c0-1.5.9-2 2-2M11 3.5h6c1.1 0 2 .5 2 2v2c0 1.5-.9 2-2 2h-6c-1.1 0-2-.5-2-2v-2c0-1.5.9-2 2-2"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgCandle2);
export default ForwardRef;
