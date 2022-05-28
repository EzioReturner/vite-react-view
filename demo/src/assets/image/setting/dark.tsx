const DarkSvg = () => (
  <svg
    width="52px"
    height="45px"
    viewBox="0 0 52 45"
    version="1.1"
    xmlns="http://www.w3.org/2000/svg"
    xmlnsXlink="http://www.w3.org/1999/xlink"
  >
    <defs>
      <filter
        x="-9.4%"
        y="-6.2%"
        width="118.8%"
        height="122.5%"
        filterUnits="objectBoundingBox"
        id="filter-1"
      >
        <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
        <feGaussianBlur
          stdDeviation="1"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        ></feGaussianBlur>
        <feColorMatrix
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.15 0"
          type="matrix"
          in="shadowBlurOuter1"
          result="shadowMatrixOuter1"
        ></feColorMatrix>
        <feMerge>
          <feMergeNode in="shadowMatrixOuter1"></feMergeNode>
          <feMergeNode in="SourceGraphic"></feMergeNode>
        </feMerge>
      </filter>
      <rect id="path-2" x="0" y="0" width="48" height="40" rx="4"></rect>
      <filter
        x="-4.2%"
        y="-2.5%"
        width="108.3%"
        height="110.0%"
        filterUnits="objectBoundingBox"
        id="filter-4"
      >
        <feOffset dx="0" dy="1" in="SourceAlpha" result="shadowOffsetOuter1"></feOffset>
        <feGaussianBlur
          stdDeviation="0.5"
          in="shadowOffsetOuter1"
          result="shadowBlurOuter1"
        ></feGaussianBlur>
        <feColorMatrix
          values="0 0 0 0 0   0 0 0 0 0   0 0 0 0 0  0 0 0 0.1 0"
          type="matrix"
          in="shadowBlurOuter1"
        ></feColorMatrix>
      </filter>
    </defs>
    <g
      id="配置面板"
      width="48"
      height="40"
      stroke="none"
      stroke-width="1"
      fill="none"
      fill-rule="evenodd"
    >
      <g
        id="setting-copy-2"
        width="48"
        height="40"
        transform="translate(-1190.000000, -136.000000)"
      >
        <g id="Group-8" width="48" height="40" transform="translate(1167.000000, 0.000000)">
          <g
            id="Group-5-Copy-5"
            filter="url(#filter-1)"
            transform="translate(25.000000, 137.000000)"
          >
            <mask id="mask-3" fill="white">
              <use xlinkHref="#path-2"></use>
            </mask>
            <g id="Rectangle-18">
              <use fill="black" fill-opacity="1" filter="url(#filter-4)" xlinkHref="#path-2"></use>
              <use fill="#303648" fill-rule="evenodd" xlinkHref="#path-2"></use>
            </g>
            <rect
              id="Rectangle-11"
              fill="#303648"
              mask="url(#mask-3)"
              x="0"
              y="0"
              width="48"
              height="10"
            ></rect>
            <rect
              id="Rectangle-18"
              fill="#303648"
              mask="url(#mask-3)"
              x="0"
              y="0"
              width="16"
              height="40"
            ></rect>
          </g>
        </g>
      </g>
    </g>
  </svg>
);

export default DarkSvg;