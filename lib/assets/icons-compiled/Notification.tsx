import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgNotification = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
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
      strokeMiterlimit={10}
      d="M9.015 2.183a4.504 4.504 0 0 0-4.5 4.5V8.85c0 .458-.195 1.155-.428 1.545l-.862 1.433c-.533.885-.165 1.867.81 2.197a15.7 15.7 0 0 0 9.952 0 1.502 1.502 0 0 0 .81-2.197l-.862-1.433c-.225-.39-.42-1.087-.42-1.545V6.683c0-2.475-2.025-4.5-4.5-4.5Z"
    />
    <path
      stroke="#01070D"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeMiterlimit={10}
      d="M10.402 2.4a5.065 5.065 0 0 0-2.775 0 1.49 1.49 0 0 1 1.387-.945c.63 0 1.17.39 1.388.945"
    />
    <path
      stroke="#01070D"
      strokeMiterlimit={10}
      d="M11.266 14.295a2.257 2.257 0 0 1-2.25 2.25 2.26 2.26 0 0 1-1.59-.66 2.26 2.26 0 0 1-.66-1.59"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgNotification);
export default ForwardRef;
