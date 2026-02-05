import * as React from "react";
import type { SVGProps } from "react";
import { Ref, forwardRef } from "react";
const SvgMeetingRoom = (
  props: SVGProps<SVGSVGElement>,
  ref: Ref<SVGSVGElement>
) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    viewBox="0 0 109 95"
    ref={ref}
    {...props}
  >
    <path
      stroke="#2372FE"
      strokeWidth={0.5}
      d="M74.813 37.848h28.676v56.051H74.813z"
    />
    <path fill="#2372FE" d="M77.445 65.332h23.413v25.934H77.445z" />
    <path fill="#fff" d="M83.925 75.059v6.844h-2.882v-6.844z" />
    <path fill="#2372FE" d="M77.445 52.008h23.413v10.085H77.445z" />
    <path fill="#fff" d="M85.731 55.609h6.844v2.882h-6.844z" />
    <path fill="#2372FE" d="M77.445 38.68h23.413v10.085H77.445z" />
    <path fill="#fff" d="M85.731 42.277h6.844v2.882h-6.844z" />
    <path stroke="#2372FE" d="M5.402 37.152V94.15h9.726V37.152" />
    <path
      stroke="#2372FE"
      d="M107.918 31.254v6.204H.498v-6.204zM30.258 86.585v-4.362a.5.5 0 0 1 .5-.5h27.816a.5.5 0 0 1 .5.5v4.362"
    />
    <circle cx={59.075} cy={90.189} r={3.462} stroke="#2372FE" />
    <circle cx={44.665} cy={90.189} r={3.462} stroke="#2372FE" />
    <circle cx={30.259} cy={90.189} r={3.462} stroke="#2372FE" />
    <path
      fill="#2372FE"
      d="M47.91 67.492h3.242V81.62H47.91zM43.227 67.492h3.242v19.09h-3.242zM38.543 67.492h3.242V81.62h-3.242z"
    />
    <path
      fill="#EDF2FF"
      stroke="#2372FE"
      d="M34.18 22.61h21.697a4.5 4.5 0 0 1 4.5 4.5v40.245H29.68V27.109l.006-.231a4.5 4.5 0 0 1 4.494-4.269Z"
    />
    <path
      stroke="#2372FE"
      d="M64.637 52.504h-3.623v14.849h3.623a1.5 1.5 0 0 0 1.5-1.5v-11.85a1.5 1.5 0 0 0-1.5-1.5ZM25.414 52.504h3.623v14.849h-3.623a1.5 1.5 0 0 1-1.5-1.5v-11.85a1.5 1.5 0 0 1 1.5-1.5ZM85.005 25.356v5.402H72.758v-5.402"
    />
    <path fill="#2372FE" d="M61.953 18.148v2.522h33.859v-2.522z" />
    <path
      stroke="#2372FE"
      d="M61.953 2.5v23.034h33.859V2.5a2 2 0 0 0-2-2H63.953a2 2 0 0 0-2 2Z"
    />
  </svg>
);
const ForwardRef = forwardRef(SvgMeetingRoom);
export default ForwardRef;
