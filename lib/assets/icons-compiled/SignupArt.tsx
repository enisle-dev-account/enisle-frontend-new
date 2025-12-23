import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSignupArt = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 880 603"
    ref={ref}
    {...props}
  >
    <path
      stroke="#fff"
      d="M650.402 629.418C537.825 753.889 348.771 766.33 228.14 657.253c-120.63-109.077-127.197-298.402-14.62-422.874 112.578-124.471 301.632-136.913 422.262-27.836 120.631 109.078 127.197 298.404 14.62 422.875Z"
    />
    <path
      stroke="#fff"
      d="M674.138 650.88c-112.577 124.471-301.631 136.912-422.261 27.835s-127.197-298.402-14.62-422.874c112.577-124.471 301.631-136.913 422.262-27.836 120.63 109.078 127.197 298.404 14.619 422.875Z"
    />
    <path
      fill="#A7F46A"
      stroke="#fff"
      strokeWidth={0.76}
      d="m197.279 250.957.086-.199-.132-.171-5.379-6.944 8.277 3.305.205.081.177-.131 7.206-5.367-3.536 8.12-.087.2.133.172 5.38 6.944-8.279-3.305-.204-.082-.177.131-7.207 5.367z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSignupArt);
export default ForwardRef;
