import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBloodPressure = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 50 51"
    ref={ref}
    {...props}
  >
    <path
      stroke="#222F35"
      d="M22.5 39.5c.333 3.833 2.9 11.3 10.5 10.5 1.911 0 6.053-1.167 8.925-5.56.8-1.223 1.075-2.697 1.075-4.158V18"
    />
    <path
      fill="#778F9B"
      stroke="#222F35"
      d="M43 .5a6.12 6.12 0 0 1 6.112 6.462l-.278 5.02a5.843 5.843 0 0 1-11.668 0l-.278-5.02A6.12 6.12 0 0 1 43 .5Z"
    />
    <path
      fill="#778F9B"
      d="M.5 37.502v-30.5c13.6-4.8 24.333-2 28 0v30.5c-7.815 2.156-15.767 2.012-21.5 1.28-2.776-.353-5.032-.845-6.5-1.28"
    />
    <path
      stroke="#222F35"
      d="M.5 7.002v30.5c1.468.435 3.724.927 6.5 1.28M.5 7.003c13.6-4.8 24.333-2 28 0m-28 0c1.468.653 3.724 1.39 6.5 1.922m21.5-1.922v30.5c-7.815 2.156-15.767 2.012-21.5 1.28m21.5-31.78C20.685 10.237 12.733 10.02 7 8.924m0 29.859V8.923"
    />
    <circle cx={25} cy={23} r={10.5} fill="#FBF8F9" stroke="#222F35" />
    <path stroke="#CC2833" d="M25 16v8" />
    <circle cx={25} cy={23} r={2} fill="#CC2833" />
  </svg>
);
const ForwardRef = forwardRef(SvgBloodPressure);
export default ForwardRef;
