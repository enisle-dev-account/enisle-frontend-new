import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgUserAdd = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 20 20"
    ref={ref}
    {...props}
  >
    <path
      fill="#2371FF"
      d="M10 12.5c-4.175 0-7.575 2.8-7.575 6.25 0 .233.183.417.417.417h14.316a.413.413 0 0 0 .417-.417c0-3.45-3.4-6.25-7.575-6.25M13.092 3.05A4.12 4.12 0 0 0 10 1.667a4.15 4.15 0 0 0-2.992 1.258 4.19 4.19 0 0 0-1.175 2.908c0 .784.217 1.517.609 2.142.208.358.475.683.791.95A4.06 4.06 0 0 0 10 10a4.15 4.15 0 0 0 3.567-2.025c.216-.358.383-.758.475-1.175q.125-.464.125-.967a4.15 4.15 0 0 0-1.075-2.783M11.558 6.6h-.775v.808a.782.782 0 1 1-1.566 0V6.6h-.775a.782.782 0 1 1 0-1.567h.775v-.741a.782.782 0 1 1 1.566 0v.741h.775a.782.782 0 1 1 0 1.567"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgUserAdd);
export default ForwardRef;
