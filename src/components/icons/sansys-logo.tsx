import type { SVGProps } from 'react';

export function SansysLogo(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 200 100" // Adjusted viewBox for a wider aspect ratio to accommodate text
      width="150" // Default width, can be overridden by props
      height="75" // Default height
      {...props}
    >
      {/* Stylized S - simplified */}
      <g transform="translate(30, 25) scale(0.4)">
        {/* Upper blue part */}
        <path
          d="M50 0 C0 0, 0 50, 50 50 C100 50, 100 100, 50 100 C0 100, 0 150, 50 150"
          fill="#00AEEF"
          transform="rotate(45 50 75)"
        />
        {/* Lower yellow part - mirrored and shifted */}
        <path
          d="M50 0 C0 0, 0 50, 50 50 C100 50, 100 100, 50 100 C0 100, 0 150, 50 150"
          fill="#FFC000"
          transform="translate(30, 40) rotate(225 50 75) scale(1, -1) translate(0, -150)"
        />
        {/* TM symbol */}
        <text
          x="115" // Positioned relative to the S mark
          y="30"  // Positioned relative to the S mark
          fontSize="12"
          fill="hsl(var(--sidebar-primary-foreground))"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          TM
        </text>
      </g>

      {/* Text: SANSYS INFORMATICS */}
      <text
        x="10" // Start a bit from the left
        y="70" // Position below the S mark
        fontSize="12"
        fill="hsl(var(--sidebar-primary-foreground))"
        fontFamily="Arial, Helvetica, sans-serif"
        fontWeight="bold"
        letterSpacing="0.5"
      >
        SANSYS INFORMATICS
      </text>

      {/* Text: Innovations Destination ! */}
      <text
        x="10" // Start a bit from the left
        y="88" // Position below "SANSYS INFORMATICS"
        fontSize="10"
        fill="hsl(var(--sidebar-primary-foreground))" // Changed to white for better contrast
        fontFamily="Arial, Helvetica, sans-serif"
        fontStyle="italic"
      >
        Innovations Destination !
      </text>
    </svg>
  );
}
