import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBed = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 25 25"
    ref={ref}
    {...props}
  >
    <path
      stroke="#fff"
      strokeWidth={1.5}
      d="M1.047 18.371h22M7.4 13.092V9.918a2 2 0 0 1 2-2h11.88a2 2 0 0 1 2 2v14.893M1.047 13.04h14M15.691 8.08v10.558"
    />
    <path fill="#fff" d="M0 0h1.5v24.812H0z" />
    <circle cx={5.531} cy={5.533} r={1.25} stroke="#fff" strokeWidth={1.5} />
  </svg>
);
const ForwardRef = forwardRef(SvgBed);
export default ForwardRef;
