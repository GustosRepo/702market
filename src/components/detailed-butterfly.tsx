const upperWing = `
  M96 88C81 51 37 5 17 14C-4 23 15 72 33 97C47 116 75 110 96 96Z
  M87 87C70 66 42 37 27 29C34 48 60 75 87 91Z
  M77 89C56 69 33 55 26 55C31 72 51 88 77 94Z
  M72 98C52 89 36 82 31 84C37 98 52 103 72 100Z
  M25 23C19 21 16 26 19 33C24 35 28 29 25 23Z
  M32 35C27 30 24 33 26 40C31 44 36 40 32 35Z
  M41 45C36 39 32 40 33 47C36 52 42 52 41 45Z
  M20 41C16 38 15 42 18 49C23 52 25 47 20 41Z
  M28 68C22 61 20 62 23 70C28 76 32 75 28 68Z
`;

const lowerWing = `
  M94 96C72 103 41 105 33 124C24 147 54 174 78 169C94 163 100 127 100 101Z
  M89 107C74 112 56 124 51 137C66 140 83 124 89 107Z
  M91 119C80 133 73 151 77 160C87 157 93 135 91 119Z
  M68 112C56 113 44 117 42 123C50 131 63 123 68 112Z
  M50 136C41 132 36 137 41 145C48 150 54 144 50 136Z
  M64 145C56 142 50 147 55 155C64 160 69 152 64 145Z
  M70 158C66 153 63 156 65 162C70 165 74 162 70 158Z
`;

type DetailedButterflyProps = {
  className?: string;
  animated?: boolean;
};

export default function DetailedButterfly({ className = "", animated = false }: DetailedButterflyProps) {
  return (
    <svg className={`detailed-butterfly ${className}`.trim()} viewBox="0 0 200 180" aria-hidden="true" focusable="false">
      <g fill="currentColor" fillRule="evenodd">
        <g className={animated ? "butterfly-wings" : undefined}>
          <path d={upperWing} />
          <path d={lowerWing} />
        </g>
        <g transform="translate(200 0) scale(-1 1)">
          <g className={animated ? "butterfly-wings" : undefined}>
            <path d={upperWing} />
            <path d={lowerWing} />
          </g>
        </g>
        <path d="M100 71C106 71 108 88 106 107L102 153Q100 164 98 153L94 107C92 88 94 71 100 71Z" />
      </g>
      <path d="M97 78Q92 57 83 50M103 78Q108 57 117 50" fill="none" stroke="currentColor" strokeLinecap="round" strokeWidth="2.5" />
    </svg>
  );
}
