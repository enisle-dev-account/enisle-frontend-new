import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgSms = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 18 18"
    ref={ref}
    {...props}
  >
    <path
      stroke="#01070D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M12.75 15.375h-7.5c-2.25 0-3.75-1.125-3.75-3.75v-5.25c0-2.625 1.5-3.75 3.75-3.75h7.5c2.25 0 3.75 1.125 3.75 3.75v5.25c0 2.625-1.5 3.75-3.75 3.75"
    />
    <path
      stroke="#01070D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="m12.75 6.75-2.347 1.875c-.773.615-2.04.615-2.813 0L5.25 6.75"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgSms);
export default ForwardRef;
