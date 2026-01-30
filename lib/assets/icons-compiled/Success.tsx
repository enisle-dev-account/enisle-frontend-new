import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSuccess = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 130 130"
    ref={ref}
    {...props}
  >
    <circle cx={65} cy={65} r={65} fill="#00D261" opacity={0.1} />
    <circle cx={65} cy={65} r={45} fill="#00D261" />
    <path
      fill="#fff"
      d="M65 51.667c-7.347 0-13.334 5.987-13.334 13.333 0 7.347 5.987 13.334 13.333 13.334 7.347 0 13.334-5.987 13.334-13.334s-5.987-13.333-13.334-13.333m6.373 10.267-7.56 7.56a1 1 0 0 1-1.414 0l-3.773-3.774a1.006 1.006 0 0 1 0-1.413 1.006 1.006 0 0 1 1.413 0l3.067 3.067 6.853-6.854a1.006 1.006 0 0 1 1.414 0 1.006 1.006 0 0 1 0 1.414"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSuccess);
export default ForwardRef;
