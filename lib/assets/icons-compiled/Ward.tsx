import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgWard = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 108 115"
    ref={ref}
    {...props}
  >
    <path
      stroke="#C55CE8"
      strokeWidth={1.5}
      d="M4.813 84.438h101.115M34.012 60.173V41.395a5 5 0 0 1 5-5h62.986a5 5 0 0 1 5 5v72.644M4.813 59.93h64.346M72.121 37.137v48.527"
    />
    <path fill="#C55CE8" d="M0 0h6.894v114.04H0z" />
    <circle
      cx={25.423}
      cy={25.434}
      r={8.442}
      stroke="#C55CE8"
      strokeWidth={1.5}
    />
  </svg>
);
const ForwardRef = forwardRef(SvgWard);
export default ForwardRef;
