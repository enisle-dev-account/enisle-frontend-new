import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSearchNormal = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 14 14"
    ref={ref}
    {...props}
  >
    <path
      stroke="#A2B0BF"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.281}
      d="M6.55 11.96a5.41 5.41 0 1 0 0-10.82 5.41 5.41 0 0 0 0 10.82M12.53 12.53l-1.14-1.139"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSearchNormal);
export default ForwardRef;
