import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSpo2 = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 30 49"
    ref={ref}
    {...props}
  >
    <path
      fill="#26B2A5"
      d="M0 4.876A4.876 4.876 0 0 1 4.876 0H24.35a4.877 4.877 0 0 1 4.877 4.876v28.542c0 8.07-6.543 14.613-14.614 14.613C6.543 48.031 0 41.49 0 33.418z"
    />
    <path
      fill="#27CCBC"
      d="M1.868 14.079c0-6.867 5.567-12.433 12.433-12.433h9.006a5.635 5.635 0 0 1 5.635 5.635v25.955c0 7.985-6.473 14.458-14.458 14.458-6.968 0-12.616-5.648-12.616-12.615z"
    />
    <path
      stroke="#0F1114"
      strokeWidth={0.5}
      d="M4.877.25H24.35a4.627 4.627 0 0 1 4.627 4.627v28.541c0 7.933-6.431 14.363-14.364 14.363C6.681 47.781.25 41.351.25 33.418V4.877A4.627 4.627 0 0 1 4.877.25Z"
    />
    <circle
      cx={14.611}
      cy={38.461}
      r={4.734}
      fill="#E1E6E9"
      stroke="#0F1114"
      strokeWidth={0.5}
    />
    <path
      fill="#fff"
      stroke="#0F1114"
      strokeWidth={0.5}
      d="M4.215 5.229h20.797v18.588H4.215z"
    />
    <path
      fill="#FF697F"
      stroke="#0F1114"
      strokeWidth={0.5}
      d="M11.272 7.045c-1.133-.952-2.228-.264-2.634.198-2.52-1.897-4.022.907-2.889 2.634.906 1.382 2.303 2.577 2.889 3.002 1.472-1.133 2.52-2.454 2.86-3.002.397-.547.906-1.88-.226-2.832Z"
    />
    <path
      stroke="#0F1114"
      strokeWidth={0.3}
      d="M4.219 19.767h1.16l.596-.765.68.765h.594l.595.82.51-.82h.736l1.387-2.804.68 5.41 1.161-2.606h1.586c.416-.406 1.49-.975 2.464 0h1.87l.537-.765.652.765h.623l.595.82.566-.82h.566l1.303-2.55.793 5.155.906-2.01"
    />
    <path
      fill="#0F1114"
      d="M13.763 12.171h8.836v.51h-8.836zM15.972 8.149h6.627v.51h-6.627z"
    />
    <rect
      width={0.68}
      height={11.328}
      x={27.015}
      y={22.263}
      fill="#fff"
      rx={0.34}
    />
    <rect
      width={0.68}
      height={2.152}
      x={27.015}
      y={18.352}
      fill="#fff"
      rx={0.34}
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSpo2);
export default ForwardRef;
