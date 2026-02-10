import CustomImage from "@atoms/CustomImage";
import Skeleton from "@atoms/Skeleton";
import Tooltip from "@atoms/Tooltip";
import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import useSWR from "swr";
import { twMerge } from "tailwind-merge";

const ReactPlayer = dynamic(() => import("react-player"), {
  ssr: false,
}) as unknown as typeof import("react-player").default;

const VinylFrame = () => (
  <svg
    className="pointer-events-none absolute inset-0 h-full w-full"
    viewBox="0 0 100 100"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <mask
      id="mask0_2570_1441"
      style={{ maskType: "alpha" }}
      maskUnits="userSpaceOnUse"
      x="0"
      y="0"
      width="101"
      height="101"
    >
      <path
        d="M14.6447 14.6447C34.171 -4.88157 65.8293 -4.88157 85.3556 14.6447C104.882 34.171 104.882 65.8294 85.3556 85.3556C65.8293 104.882 34.1709 104.882 14.6447 85.3556C-4.88158 65.8294 -4.88154 34.171 14.6447 14.6447ZM50.0001 25.0002C36.2148 25.0002 25.0001 36.2148 25.0001 50.0002C25.0003 63.7854 36.2149 75.0002 50.0001 75.0002C63.7853 75.0001 75 63.7853 75.0001 50.0002C75.0001 36.2149 63.7854 25.0003 50.0001 25.0002Z"
        fill="black"
      />
    </mask>
    <g mask="url(#mask0_2570_1441)">
      <path
        d="M85.3554 85.3553C104.882 65.8291 104.882 34.1707 85.3554 14.6444C65.8291 -4.88185 34.1708 -4.88186 14.6445 14.6444C-4.88176 34.1707 -4.88176 65.8291 14.6445 85.3553C34.1708 104.882 65.8291 104.882 85.3554 85.3553Z"
        fill="#090909"
      />
      <path
        opacity="0.7"
        d="M50.0001 96.1401C24.5589 96.1401 3.85938 75.4405 3.85938 49.9994C3.85938 24.5582 24.5589 3.85864 50.0001 3.85864C75.4413 3.85864 96.1408 24.5582 96.1408 49.9994C96.1408 75.4405 75.4413 96.1401 50.0001 96.1401Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M50.0001 93.8388C25.827 93.8388 6.16064 74.1724 6.16064 49.9993C6.16064 25.8263 25.827 6.15991 50.0001 6.15991C74.1731 6.15991 93.8395 25.8263 93.8395 49.9993C93.8395 74.1724 74.1731 93.8388 50.0001 93.8388Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M50.0001 91.6526C27.0329 91.6526 8.34692 72.9667 8.34692 49.9994C8.34692 27.0321 27.0329 8.34619 50.0001 8.34619C72.9674 8.34619 91.6534 27.0321 91.6534 49.9994C91.6534 72.9667 72.9674 91.6526 50.0001 91.6526Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M50.0001 89.5743C28.1787 89.5743 10.4229 71.8209 10.4229 49.9971C10.4229 28.1732 28.1763 10.4198 50.0001 10.4198C71.824 10.4198 89.5774 28.1732 89.5774 49.9971C89.5774 71.8209 71.824 89.5743 50.0001 89.5743Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M49.9999 87.6013C29.2644 87.6013 12.3979 70.7325 12.3979 49.9993C12.3979 29.2662 29.2668 12.3973 49.9999 12.3973C70.7331 12.3973 87.6019 29.2662 87.6019 49.9993C87.6019 70.7325 70.7331 87.6013 49.9999 87.6013Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M50.0001 85.7268C30.3002 85.7268 14.2727 69.6993 14.2727 49.9994C14.2727 30.2994 30.3002 14.272 50.0001 14.272C69.7001 14.272 85.7275 30.2994 85.7275 49.9994C85.7275 69.6993 69.7001 85.7268 50.0001 85.7268Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M50 83.9457C31.2829 83.9457 16.0537 68.7165 16.0537 49.9994C16.0537 31.2823 31.2829 16.0531 50 16.0531C68.7171 16.0531 83.9463 31.2823 83.9463 49.9994C83.9463 68.7165 68.7171 83.9457 50 83.9457Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M50 82.2533C32.2154 82.2533 17.7461 67.784 17.7461 49.9994C17.7461 32.2148 32.2154 17.7455 50 17.7455C67.7846 17.7455 82.2539 32.2148 82.2539 49.9994C82.2539 67.784 67.7846 82.2533 50 82.2533Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M50.0001 80.6448C33.1025 80.6448 19.3547 66.8971 19.3547 49.9994C19.3547 33.1018 33.1025 19.354 50.0001 19.354C66.8978 19.354 80.6456 33.1018 80.6456 49.9994C80.6456 66.8971 66.8978 80.6448 50.0001 80.6448Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <path
        opacity="0.7"
        d="M50 79.1155C33.9438 79.1155 20.8816 66.0533 20.8816 49.9994C20.8816 33.9456 33.9438 20.8834 50 20.8834C66.0563 20.8834 79.1184 33.9456 79.1184 49.9994C79.1184 66.0533 66.0563 79.1155 50 79.1155Z"
        stroke="#090909"
        strokeWidth="0.507001"
        strokeMiterlimit="10"
      />
      <g opacity="0.7">
        <path
          d="M50.0001 98.5612C23.2237 98.5612 1.43823 76.7757 1.43823 49.9994C1.43823 23.223 23.2237 1.4375 50.0001 1.4375C76.7765 1.4375 98.562 23.223 98.562 49.9994C98.562 76.7757 76.7765 98.5612 50.0001 98.5612Z"
          stroke="#161515"
          strokeWidth="0.507001"
          strokeMiterlimit="10"
        />
        <path
          d="M50 4.422C75.1319 4.422 95.5774 24.8675 95.5774 49.9994C95.5774 75.1313 75.1319 95.5768 50 95.5768C24.8681 95.5768 4.42261 75.1289 4.42261 49.9994C4.42261 24.8698 24.8681 4.422 50 4.422Z"
          stroke="#181717"
          strokeWidth="0.507001"
          strokeMiterlimit="10"
        />
        <path
          d="M49.9999 7.40649C73.485 7.40649 92.5904 26.5119 92.5904 49.997C92.5904 73.4821 73.485 92.5875 49.9999 92.5875C26.5149 92.5875 7.40942 73.4821 7.40942 49.997C7.40942 26.5119 26.5149 7.40649 49.9999 7.40649Z"
          stroke="#191818"
          strokeWidth="0.507001"
          strokeMiterlimit="10"
        />
        <path
          d="M50.0001 10.3934C71.8383 10.3934 89.6061 28.1613 89.6061 49.9995C89.6061 71.8377 71.8383 89.6055 50.0001 89.6055C28.1619 89.6055 10.394 71.8377 10.394 49.9995C10.394 28.1613 28.1619 10.3934 50.0001 10.3934Z"
          stroke="#1B1A1A"
          strokeWidth="0.507001"
          strokeMiterlimit="10"
        />
        <path
          d="M50 13.3778C70.1937 13.3778 86.6215 29.8056 86.6215 49.9994C86.6215 70.1931 70.1937 86.6209 50 86.6209C29.8062 86.6209 13.3784 70.1931 13.3784 49.9994C13.3784 29.8056 29.8062 13.3778 50 13.3778Z"
          stroke="#1C1B1B"
          strokeWidth="0.507001"
          strokeMiterlimit="10"
        />
        <path
          d="M50.0002 16.3623C68.5471 16.3623 83.6349 31.4501 83.6349 49.997C83.6349 68.5439 68.5471 83.6317 50.0002 83.6317C31.4533 83.6317 16.3655 68.5439 16.3655 49.997C16.3655 31.4501 31.4533 16.3623 50.0002 16.3623Z"
          stroke="#1E1D1D"
          strokeWidth="0.507001"
          strokeMiterlimit="10"
        />
        <path
          d="M50.0001 19.3491C66.9001 19.3491 80.6503 33.0993 80.6503 49.9993C80.6503 66.8994 66.9001 80.6495 50.0001 80.6495C33.1 80.6495 19.3499 66.8994 19.3499 49.9993C19.3499 33.0993 33.1 19.3491 50.0001 19.3491Z"
          stroke="#1F1E1E"
          strokeWidth="0.507001"
          strokeMiterlimit="10"
        />
        <path
          d="M50 77.6651C34.7444 77.6651 22.3342 65.2549 22.3342 49.9993C22.3342 34.7438 34.7444 22.3336 50 22.3336C65.2555 22.3336 77.6657 34.7438 77.6657 49.9993C77.6657 65.2549 65.2555 77.6651 50 77.6651Z"
          stroke="#212020"
          strokeWidth="0.507001"
          strokeMiterlimit="10"
        />
      </g>
      <g opacity="0.15">
        <path
          d="M-7.15331 54.0506L51.1986 47.8467L-10.1689 69.076L-7.15331 54.0506Z"
          fill="white"
        />
      </g>
      <g opacity="0.15">
        <path
          d="M112.113 43.8171L53.6772 47.1204L115.361 32.886L112.113 43.8171Z"
          fill="white"
        />
      </g>
      <g opacity="0.25">
        <path
          d="M0.378662 82.6105L38.9731 58.4614L9.48791 93.0238L0.378662 82.6105Z"
          fill="white"
        />
      </g>
      <g opacity="0.25">
        <path
          d="M98.9023 15.6552L60.3079 39.8067L89.793 5.24426L98.9023 15.6552Z"
          fill="white"
        />
      </g>
    </g>
    <path
      d="M50 50.9631C49.4679 50.9631 49.0364 50.5316 49.0364 49.9994C49.0364 49.4673 49.4679 49.0358 50 49.0358C50.5322 49.0358 50.9637 49.4673 50.9637 49.9994C50.9637 50.5316 50.5322 50.9631 50 50.9631Z"
      fill="#090909"
    />
  </svg>
);

const TONEARM_SHADOW_LEFT = 7.73;
const TONEARM_SHADOW_TOP = 6.76;

const TonearmSvg = () => (
  <svg
    className="absolute block"
    style={{
      left: -TONEARM_SHADOW_LEFT,
      top: -TONEARM_SHADOW_TOP,
      width: 43.45,
      height: 83.44,
    }}
    viewBox="0 0 43.4483 83.4445"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    overflow="visible"
  >
    <g filter="url(#ta_filter0)">
      <g>
        <path
          d="M21.7241 34.7586C29.4561 34.7586 35.7241 28.4906 35.7241 20.7586C35.7241 13.0266 29.4561 6.75862 21.7241 6.75862C13.9922 6.75862 7.72414 13.0266 7.72414 20.7586C7.72414 28.4906 13.9922 34.7586 21.7241 34.7586Z"
          fill="#262628"
        />
        <path
          d="M21.7241 6.87874C29.39 6.87874 35.604 13.0927 35.604 20.7586C35.604 28.4245 29.39 34.6385 21.7241 34.6385C14.0582 34.6385 7.84426 28.4245 7.84425 20.7586C7.84425 13.0927 14.0582 6.87874 21.7241 6.87874Z"
          stroke="black"
          strokeOpacity="0.4"
          strokeWidth="0.239316"
        />
      </g>
      <path
        d="M21.7241 29.374C26.4823 29.374 30.3395 25.5167 30.3395 20.7586C30.3395 16.0004 26.4823 12.1432 21.7241 12.1432C16.966 12.1432 13.1088 16.0004 13.1088 20.7586C13.1088 25.5167 16.966 29.374 21.7241 29.374Z"
        fill="#181819"
      />
      <g>
        <mask id="ta_mask0" fill="white">
          <path d="M21.7243 15.6133C24.5659 15.6134 26.8698 17.9172 26.8698 20.7588C26.8697 23.0957 25.3111 25.068 23.1771 25.695C22.9603 25.7587 22.8015 25.9515 22.8015 26.1774V61.2762C22.8015 61.5406 23.0158 61.7549 23.2801 61.7549H23.7457C24.01 61.7549 24.2243 61.9692 24.2243 62.2335V74.2762C24.2243 74.5406 24.01 74.7549 23.7457 74.7549H19.703C19.4386 74.7549 19.2243 74.5406 19.2243 74.2762V62.2335C19.2243 61.9692 19.4386 61.7549 19.703 61.7549H19.9303C20.1946 61.7549 20.4089 61.5406 20.4089 61.2762V26.1022C20.4089 25.8848 20.2615 25.697 20.0559 25.6265C18.0332 24.9336 16.5789 23.0164 16.5788 20.7588C16.5788 17.9171 18.8826 15.6133 21.7243 15.6133Z" />
        </mask>
        <path
          d="M21.7243 15.6133C24.5659 15.6134 26.8698 17.9172 26.8698 20.7588C26.8697 23.0957 25.3111 25.068 23.1771 25.695C22.9603 25.7587 22.8015 25.9515 22.8015 26.1774V61.2762C22.8015 61.5406 23.0158 61.7549 23.2801 61.7549H23.7457C24.01 61.7549 24.2243 61.9692 24.2243 62.2335V74.2762C24.2243 74.5406 24.01 74.7549 23.7457 74.7549H19.703C19.4386 74.7549 19.2243 74.5406 19.2243 74.2762V62.2335C19.2243 61.9692 19.4386 61.7549 19.703 61.7549H19.9303C20.1946 61.7549 20.4089 61.5406 20.4089 61.2762V26.1022C20.4089 25.8848 20.2615 25.697 20.0559 25.6265C18.0332 24.9336 16.5789 23.0164 16.5788 20.7588C16.5788 17.9171 18.8826 15.6133 21.7243 15.6133Z"
          fill="#D9D9D9"
        />
        <path
          d="M21.7243 15.6133L21.7243 15.3739H21.7243V15.6133ZM26.8698 20.7588L27.1091 20.7588V20.7588H26.8698ZM16.5788 20.7588H16.3395V20.7588L16.5788 20.7588ZM20.0559 25.6265L20.1334 25.4001V25.4001L20.0559 25.6265ZM23.1771 25.695L23.2445 25.9246L23.1771 25.695ZM21.7243 15.6133L21.7243 15.8526C24.4337 15.8527 26.6305 18.0494 26.6305 20.7588H26.8698H27.1091C27.1091 17.785 24.6981 15.3741 21.7243 15.3739L21.7243 15.6133ZM26.8698 20.7588L26.6305 20.7588C26.6304 22.9866 25.1446 24.8675 23.1096 25.4654L23.1771 25.695L23.2445 25.9246C25.4776 25.2685 27.109 23.2048 27.1091 20.7588L26.8698 20.7588ZM22.8015 26.1774H22.5622V61.2762H22.8015H23.0408V26.1774H22.8015ZM23.2801 61.7549V61.9942H23.7457V61.7549V61.5156H23.2801V61.7549ZM24.2243 62.2335H23.985V74.2762H24.2243H24.4636V62.2335H24.2243ZM23.7457 74.7549V74.5156H19.703V74.7549V74.9942H23.7457V74.7549ZM19.2243 74.2762H19.4636V62.2335H19.2243H18.985V74.2762H19.2243ZM19.703 61.7549V61.9942H19.9303V61.7549V61.5156H19.703V61.7549ZM20.4089 61.2762H20.6482V26.1022H20.4089H20.1696V61.2762H20.4089ZM20.0559 25.6265L20.1334 25.4001C18.2045 24.7393 16.8182 22.9109 16.8181 20.7588L16.5788 20.7588L16.3395 20.7588C16.3396 23.1218 17.8619 25.1279 19.9783 25.8529L20.0559 25.6265ZM16.5788 20.7588H16.8181C16.8181 18.0493 19.0148 15.8526 21.7243 15.8526V15.6133V15.3739C18.7505 15.3739 16.3395 17.7849 16.3395 20.7588H16.5788ZM20.4089 26.1022H20.6482C20.6482 25.7726 20.4261 25.5004 20.1334 25.4001L20.0559 25.6265L19.9783 25.8529C20.0969 25.8936 20.1696 25.997 20.1696 26.1022H20.4089ZM19.9303 61.7549V61.9942C20.3268 61.9942 20.6482 61.6727 20.6482 61.2762H20.4089H20.1696C20.1696 61.4084 20.0624 61.5156 19.9303 61.5156V61.7549ZM19.2243 62.2335H19.4636C19.4636 62.1013 19.5708 61.9942 19.703 61.9942V61.7549V61.5156C19.3064 61.5156 18.985 61.837 18.985 62.2335H19.2243ZM19.703 74.7549V74.5156C19.5708 74.5156 19.4636 74.4084 19.4636 74.2762H19.2243H18.985C18.985 74.6727 19.3064 74.9942 19.703 74.9942V74.7549ZM24.2243 74.2762H23.985C23.985 74.4084 23.8779 74.5156 23.7457 74.5156V74.7549V74.9942C24.1422 74.9942 24.4636 74.6727 24.4636 74.2762H24.2243ZM23.7457 61.7549V61.9942C23.8779 61.9942 23.985 62.1013 23.985 62.2335H24.2243H24.4636C24.4636 61.837 24.1422 61.5156 23.7457 61.5156V61.7549ZM22.8015 61.2762H22.5622C22.5622 61.6727 22.8836 61.9942 23.2801 61.9942V61.7549V61.5156C23.1479 61.5156 23.0408 61.4084 23.0408 61.2762H22.8015ZM23.1771 25.695L23.1096 25.4654C22.8015 25.5559 22.5622 25.8348 22.5622 26.1774H22.8015H23.0408C23.0408 26.0683 23.1192 25.9614 23.2445 25.9246L23.1771 25.695Z"
          fill="black"
          fillOpacity="0.25"
          mask="url(#ta_mask0)"
        />
      </g>
    </g>
    <path
      d="M19.5518 74.4129H23.6552V62.6289C23.6552 62.4797 23.5212 62.3663 23.3741 62.3908L23.3311 62.3979C22.7426 62.496 22.2069 62.0422 22.2069 61.4456V26.3784L22.2197 26.0859C22.2406 25.6086 22.6126 25.2299 23.0686 25.0877C24.8862 24.5208 26.1739 22.7675 26.1739 20.7586C26.1739 18.3011 24.1817 16.3089 21.7242 16.3089"
      stroke="white"
      strokeOpacity="0.45"
      strokeWidth="0.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <defs>
      <filter
        id="ta_filter0"
        x="0"
        y="0"
        width="43.4483"
        height="83.4445"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.965517" />
        <feGaussianBlur stdDeviation="3.86207" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1.93103" />
        <feGaussianBlur stdDeviation="0.965517" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow"
          result="effect2_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.482759" />
        <feGaussianBlur stdDeviation="0.241379" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_dropShadow"
          result="effect3_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect3_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const Tonearm = ({ active }: { active: boolean }) => (
  <div
    className={twMerge(
      "absolute overflow-visible transition-transform duration-500",
      active ? "rotate-[34deg]" : "rotate-0",
    )}
    style={{
      left: 107,
      top: 7,
      width: 28,
      height: 68,
      transformOrigin: "14px 14px",
    }}
  >
    <TonearmSvg />
  </div>
);

const ThumbSvg = () => (
  <svg
    className="absolute block"
    style={{ left: -8, top: -7, width: 30, height: 21.5 }}
    viewBox="0 0 30.0001 21.5"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    overflow="visible"
  >
    <g filter="url(#th_filter0)">
      <rect
        x="8.00002"
        y="7.00002"
        width="14"
        height="5.50001"
        rx="2.75001"
        fill="#D9D9D9"
      />
      <rect
        x="8.12395"
        y="7.12395"
        width="13.7522"
        height="5.25215"
        rx="2.62607"
        stroke="black"
        strokeOpacity="0.25"
        strokeWidth="0.247864"
      />
    </g>
    <path
      d="M19.25 7.50008C20.4926 7.50008 21.5 8.50743 21.5 9.75008C21.5 9.87464 21.4863 9.99625 21.4668 10.1153C21.2815 8.91758 20.2496 8.00008 19 8.00008H11C9.75029 8.00008 8.71749 8.91751 8.53221 10.1153C8.51276 9.9963 8.49999 9.87458 8.49999 9.75008C8.49999 8.50744 9.50735 7.50008 10.75 7.50008H19.25Z"
      fill="white"
      fillOpacity="0.55"
    />
    <defs>
      <filter
        id="th_filter0"
        x="0"
        y="0"
        width="30.0001"
        height="21.5"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1" />
        <feGaussianBlur stdDeviation="4.00001" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0"
        />
        <feBlend
          mode="normal"
          in2="BackgroundImageFix"
          result="effect1_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="2" />
        <feGaussianBlur stdDeviation="1" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.12 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_dropShadow"
          result="effect2_dropShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.500001" />
        <feGaussianBlur stdDeviation="0.250001" />
        <feComposite in2="hardAlpha" operator="out" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.04 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_dropShadow"
          result="effect3_dropShadow"
        />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="effect3_dropShadow"
          result="shape"
        />
      </filter>
    </defs>
  </svg>
);

const THUMB_TOP_OFF = 18.5;
const THUMB_TOP_ON = 0;

const Slider = ({ active }: { active: boolean }) => (
  <div
    className="absolute"
    style={{ left: 114, top: 83, width: 14, height: 24 }}
  >
    <div
      className="absolute rounded-[2px]"
      style={{
        left: 4,
        top: 0,
        width: 6,
        height: 24,
        background: "linear-gradient(to bottom, #4e4e50, #3f3f41)",
        border: "0.248px solid rgba(0,0,0,0.2)",
        boxShadow:
          "inset 0px 1px 1px 0px rgba(255,255,255,0.25), inset 0px 0.5px 0.5px 0px rgba(0,0,0,0.25), inset 0px 1.5px 2.5px 0px rgba(0,0,0,0.25), inset 0px 4px 5px 0px rgba(0,0,0,0.25)",
      }}
    />
    {/* Thumb — content 14×5.5, viewBox 30×21.5 (includes shadow) */}
    <div
      className="absolute overflow-visible transition-[top] duration-500"
      style={{
        left: 0,
        top: active ? THUMB_TOP_ON : THUMB_TOP_OFF,
        width: 14,
        height: 5.5,
      }}
    >
      <ThumbSvg />
    </div>
  </div>
);

const PlayButtonSvg = ({ paused }: { paused: boolean }) => (
  <svg
    className="block size-full"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <g clipPath="url(#pb_clip0)">
      <g>
        <g filter="url(#pb_filter0)">
          <circle cx="8" cy="8" r="8" fill="#D9D9D9" />
        </g>
        <circle
          cx="8"
          cy="8"
          r="7.91148"
          stroke="black"
          strokeOpacity="0.2"
          strokeWidth="0.177046"
        />
      </g>
      <circle cx="8" cy="8" r="6.85714" fill="url(#pb_paint0)" />
      <g filter="url(#pb_filter1)">
        {paused ? (
          <>
            <path
              d="M6.02759 7.60162C6.02759 7.24286 6.31848 6.95197 6.67734 6.95197H9.32262C9.68148 6.95197 9.97237 7.24286 9.97237 7.60162V8.39838C9.97237 8.75714 9.68148 9.04803 9.32262 9.04803H6.67734C6.31848 9.04803 6.02759 8.75714 6.02759 8.39838V7.60162Z"
              fill="url(#pb_paint0)"
            />
            <path
              d="M5.92798 6.07324C5.92816 5.19062 6.93658 4.68652 7.64282 5.21582L10.3088 7.21582C10.8803 7.64439 10.8803 8.50209 10.3088 8.93066L7.64282 10.9307C6.93654 11.4602 5.92808 10.956 5.92798 10.0732V6.07324ZM7.21411 5.78711C6.97875 5.61102 6.64301 5.77924 6.64282 6.07324V10.0732C6.64293 10.3674 6.97871 10.5349 7.21411 10.3584L9.8811 8.3584C10.071 8.21546 10.0713 7.92988 9.8811 7.78711L7.21411 5.78711Z"
              fill="url(#pb_paint1)"
              fillOpacity="0.2"
            />
          </>
        ) : (
          <path
            d="M6.50024 10.5C6.50024 10.7761 6.27639 11 6.00024 11C5.7241 11 5.50024 10.7761 5.50024 10.5V5.5C5.50024 5.22386 5.7241 5 6.00024 5C6.27639 5 6.50024 5.22386 6.50024 5.5V10.5ZM10.5002 10.5C10.5002 10.7761 10.2764 11 10.0002 11C9.7241 11 9.50024 10.7761 9.50024 10.5V5.5C9.50024 5.22386 9.7241 5 10.0002 5C10.2764 5 10.5002 5.22386 10.5002 5.5V10.5Z"
            fill="url(#pb_paint1)"
            fillOpacity="0.2"
          />
        )}
      </g>
    </g>
    <defs>
      <filter
        id="pb_filter0"
        x="0"
        y="0"
        width="16"
        height="16.7143"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.714286" />
        <feGaussianBlur stdDeviation="0.357143" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
        />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
      </filter>
      <filter
        id="pb_filter1"
        x="5.5"
        y="5"
        width="5.5"
        height="7.07143"
        filterUnits="userSpaceOnUse"
        colorInterpolationFilters="sRGB"
      >
        <feFlood floodOpacity="0" result="BackgroundImageFix" />
        <feBlend
          mode="normal"
          in="SourceGraphic"
          in2="BackgroundImageFix"
          result="shape"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="1.07143" />
        <feGaussianBlur stdDeviation="0.892859" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend mode="normal" in2="shape" result="effect1_innerShadow" />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.357144" />
        <feGaussianBlur stdDeviation="0.178572" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="effect1_innerShadow"
          result="effect2_innerShadow"
        />
        <feColorMatrix
          in="SourceAlpha"
          type="matrix"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
          result="hardAlpha"
        />
        <feOffset dy="0.714286" />
        <feGaussianBlur stdDeviation="0.357143" />
        <feComposite in2="hardAlpha" operator="arithmetic" k2="-1" k3="1" />
        <feColorMatrix
          type="matrix"
          values="0 0 0 0 1 0 0 0 0 1 0 0 0 0 1 0 0 0 0.25 0"
        />
        <feBlend
          mode="normal"
          in2="effect2_innerShadow"
          result="effect3_innerShadow"
        />
      </filter>
      <linearGradient
        id="pb_paint0"
        x1="8"
        y1="1.14286"
        x2="8"
        y2="14.8571"
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity="0.25" />
        <stop offset="1" stopColor="white" stopOpacity="0" />
      </linearGradient>
      <linearGradient
        id="pb_paint1"
        x1={paused ? "8.90981" : "9.10023"}
        y1={paused ? "5" : "6"}
        x2={paused ? "8.90981" : "9.10023"}
        y2={paused ? "11.1469" : "12"}
        gradientUnits="userSpaceOnUse"
      >
        <stop />
        <stop offset="1" stopOpacity="0" />
      </linearGradient>
      <clipPath id="pb_clip0">
        <rect width="16" height="16" fill="white" />
      </clipPath>
    </defs>
  </svg>
);

const BOX_WIDTH = 148;
const BOX_HEIGHT = 114;
const VINYL_SIZE = 100;
const COVER_SIZE = 50;
const VINYL_OFFSET = 7;
const PLAY_BUTTON_SIZE = 16;

const fetcher = (url: string) => fetch(url).then((r) => r.json());

const SpotifyPlayer = () => {
  const { data } = useSWR("/api/spotify", fetcher);

  const ytQuery =
    data?.title && data?.artist
      ? `/api/ytmusic?q=${encodeURIComponent(`${data.title} ${data.artist}`)}`
      : null;
  const { data: ytData } = useSWR(ytQuery, fetcher);

  const [isPlaying, setIsPlaying] = useState(false);

  const videoId = ytData?.videoId as string | undefined;

  // Reset playback when track changes
  useEffect(() => {
    setIsPlaying(false);
  }, [videoId]);

  return (
    <>
      {data ? (
        <div className="flex items-center gap-4">
          {/* Player Box */}
          <div
            className="relative shrink-0 overflow-hidden rounded-xl"
            style={{
              width: BOX_WIDTH,
              height: BOX_HEIGHT,
              background: "rgba(0,0,0,0.1)",
              boxShadow:
                "0px 1px 2px 0px rgba(0,0,0,0.3), 0px 2px 6px 2px rgba(0,0,0,0.15)",
            }}
          >
            {/* Disk Frame shadow — positioned with inset, rotated -45° */}
            <svg
              className="pointer-events-none absolute -rotate-45"
              style={{
                top: "-9.4%",
                bottom: "-14.66%",
                left: "-7.91%",
                right: "12.36%",
                width: 100,
                height: 100,
                margin: "auto",
              }}
              viewBox="0 0 100 100"
              fill="none"
            >
              <path
                opacity="0.05"
                d="M50.0002 100C77.6145 100 100 77.6145 100 50.0002C100 22.3858 77.6145 0 50.0002 0C22.3858 0 0 22.3858 0 50.0002C0 77.6145 22.3858 100 50.0002 100Z"
                fill="#090909"
              />
            </svg>

            {/* Vinyl record */}
            <div
              className="absolute"
              style={{
                left: VINYL_OFFSET,
                top: VINYL_OFFSET,
                width: VINYL_SIZE,
                height: VINYL_SIZE,
              }}
            >
              {/* Cover (centered in vinyl) */}
              <div
                className={twMerge(
                  "absolute overflow-hidden rounded-full",
                  data.isPlaying && "animate-spin-slow",
                )}
                style={{
                  width: COVER_SIZE,
                  height: COVER_SIZE,
                  top: (VINYL_SIZE - COVER_SIZE) / 2,
                  left: (VINYL_SIZE - COVER_SIZE) / 2,
                }}
              >
                <CustomImage
                  className="overflow-hidden rounded-full"
                  width={COVER_SIZE}
                  height={COVER_SIZE}
                  src={data.albumImageUrl}
                  alt={data.title}
                />
              </div>
              <VinylFrame />
            </div>

            {/* Counterweight shadow — positioned with inset, rotated -45° */}
            <svg
              className="pointer-events-none absolute -rotate-45"
              style={{
                top: "3.51%",
                bottom: "63.16%",
                left: "70.27%",
                right: "4.05%",
                width: 26.87,
                height: 26.87,
                margin: "auto",
              }}
              viewBox="0 0 26.8701 26.8701"
              fill="none"
            >
              <path
                opacity="0.05"
                d="M13.435 26.8701C20.855 26.8701 26.8701 20.855 26.8701 13.435C26.8701 6.01507 20.855 0 13.435 0C6.01507 0 0 6.01507 0 13.435C0 20.855 6.01507 26.8701 13.435 26.8701Z"
                fill="#090909"
              />
            </svg>

            {/* Tonearm — rotates when Spotify is playing OR user is listening */}
            <Tonearm active={data.isPlaying || isPlaying} />

            {/* Slider — thumb up when listening */}
            <Slider active={isPlaying} />

            {/* Play button — inline Figma SVG */}
            <Tooltip content={isPlaying ? "Pause listening" : "Listen with me"}>
              <button
                type="button"
                onClick={() => setIsPlaying((prev) => !prev)}
                disabled={!videoId}
                className="absolute cursor-pointer border-0 bg-transparent p-0 transition-opacity disabled:cursor-default disabled:opacity-30"
                style={{
                  left: 127,
                  top: 49,
                  width: PLAY_BUTTON_SIZE,
                  height: PLAY_BUTTON_SIZE,
                }}
                aria-label={isPlaying ? "Pause listening" : "Listen with me"}
              >
                <PlayButtonSvg paused={!isPlaying} />
              </button>
            </Tooltip>

            {/* Inset glass highlight */}
            <div
              className="pointer-events-none absolute inset-0 rounded-xl"
              style={{
                boxShadow:
                  "inset 0px 4px 10px rgba(255,255,255,0.12), inset 0px 1px 1px white",
              }}
            />
          </div>

          {/* Hidden audio player */}
          {videoId && (
            <ReactPlayer
              src={`https://www.youtube.com/watch?v=${videoId}`}
              playing={isPlaying}
              volume={0.5}
              width={0}
              height={0}
              style={{ position: "absolute", visibility: "hidden" }}
              onEnded={() => setIsPlaying(false)}
              onError={() => setIsPlaying(false)}
            />
          )}

          {/* Song info */}
          <div className="flex shrink grow flex-col">
            <p className="muted-text _text-sm _text-secondary">
              {data.isPlaying ? "Now playing" : "Offline - Recently played"}
            </p>
            <p className="max-w-full text-base font-normal tracking-tight">
              {data.artist} <span className="text-secondary">-</span>{" "}
              <a href={data.songUrl} target="_blank" rel="noreferrer">
                {data.title}
              </a>
            </p>
          </div>
        </div>
      ) : (
        <Skeleton.Wrapper loaded={false} className="flex items-center gap-4">
          <Skeleton
            className="h-[114px] w-[148px] shrink-0 rounded-xl"
            type="inline"
          />
          <div className="flex shrink grow flex-col">
            <Skeleton className="h-3.5 w-32 rounded-full" type="inline" />
            <Skeleton className="mt-2 h-4 w-60 rounded-full" type="inline" />
          </div>
        </Skeleton.Wrapper>
      )}
    </>
  );
};

export default SpotifyPlayer;
