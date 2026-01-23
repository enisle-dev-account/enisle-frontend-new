import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgBmi = (props: SVGProps<SVGSVGElement>, ref: Ref<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 53 53"
    ref={ref}
    {...props}
  >
    <path
      fill="#D9FFEA"
      stroke="#00D261"
      d="M10.892 11.113h30.991a5 5 0 0 1 5 5v8.853l-2.818 22.752a5 5 0 0 1-4.962 4.385H13.801a5 5 0 0 1-4.958-4.357l-2.95-22.78v-8.853a5 5 0 0 1 5-5Z"
    />
    <path
      fill="#F7FFFA"
      d="M.723 35.668v-8.426l.827.155c13.577-.051 41.662-.124 45.384 0 3.721.124 4.824 2.326 4.91 3.412v7.133c-.827-1.613-3.308-2.188-4.445-2.274z"
    />
    <path
      fill="#00D261"
      d="M47.812 26.979h1.654v3.722h-1.654zM3.358 26.977h1.654v2.895H3.358zM6.769 26.977h1.654v2.895H6.769zM10.18 26.977h1.654v2.895H10.18zM13.592 26.977h1.654v2.895h-1.654zM17.003 26.977h1.654v2.895h-1.654zM20.414 26.977h1.654v2.895h-1.654zM23.825 26.977h1.654v2.895h-1.654zM27.237 26.977h1.654v2.895h-1.654zM30.65 26.977h1.654v2.895H30.65zM34.062 26.977h1.654v2.895h-1.654zM37.473 26.977h1.654v2.895h-1.654zM40.884 26.977h1.654v2.895h-1.654zM44.297 26.977h1.654v2.895h-1.654z"
    />
    <path
      stroke="#00D261"
      d="M.826 27.294v8.529H47.71a4.29 4.29 0 1 1 0 8.58h-3.256"
    />
    <path stroke="#00D261" d="M0 27.294h48a4 4 0 0 1 4 4v9.336" />
    <circle
      cx={26.414}
      cy={11.992}
      r={11.492}
      fill="#D9FFEA"
      stroke="#00D261"
    />
    <circle cx={26.413} cy={11.987} r={2.084} stroke="#00D261" />
    <path stroke="#00D261" d="M26.413 3.408v7" />
  </svg>
);
const ForwardRef = forwardRef(SvgBmi);
export default ForwardRef;
