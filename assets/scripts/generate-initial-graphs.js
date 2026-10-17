const fs = require('fs');
const path = require('path');

function generateGraphSvg({
    width = 1200,
    height = 420,
    radius = 15,
    bgColor = '0d1117',
    borderColor = '00BFFF',
    textColor = 'c9d1d9',
    titleColor = '00BFFF',
    lineColor = 'FFD700',
    pointColor = '00BFFF',
    areaColor = 'FFD700',
    title = "Myst-Blazeio's Contribution Graph",
    contributions = [1, 2, 0, 4, 3, 5, 2, 6, 8, 4, 5, 7, 3, 9, 12, 8, 14, 10, 15, 11, 7, 9, 13, 8, 10, 12, 14, 9, 16, 12, 18]
}) {
    const left = 90;
    const right = 1150;
    const top = 90;
    const bottom = 350;
    const chartWidth = right - left;
    const chartHeight = bottom - top;

    const maxVal = Math.max(...contributions, 20);
    const stepX = chartWidth / (contributions.length - 1);

    const points = contributions.map((val, idx) => {
        const x = left + idx * stepX;
        const y = bottom - (val / maxVal) * chartHeight;
        return { x: Number(x.toFixed(1)), y: Number(y.toFixed(1)), val };
    });

    // Build SVG path
    let dLine = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
        // smooth bezier
        const prev = points[i - 1];
        const curr = points[i];
        const cpX = (prev.x + curr.x) / 2;
        dLine += ` C ${cpX} ${prev.y}, ${cpX} ${curr.y}, ${curr.x} ${curr.y}`;
    }

    const dArea = `${dLine} L ${points[points.length - 1].x} ${bottom} L ${points[0].x} ${bottom} Z`;

    // Horizontal grid lines
    const yGridCount = 5;
    let gridLinesSvg = '';
    let yLabelsSvg = '';
    for (let i = 0; i <= yGridCount; i++) {
        const y = bottom - (i / yGridCount) * chartHeight;
        const val = Math.round((i / yGridCount) * maxVal);
        gridLinesSvg += `<line x1="${left}" y1="${y}" x2="${right}" y2="${y}" class="ct-grid" />\n`;
        yLabelsSvg += `<text x="${left - 15}" y="${y + 4}" class="ct-label y-label" text-anchor="end">${val}</text>\n`;
    }

    // Vertical grid and X labels
    let xGridLinesSvg = '';
    let xLabelsSvg = '';
    points.forEach((pt, idx) => {
        xGridLinesSvg += `<line x1="${pt.x}" y1="${top}" x2="${pt.x}" y2="${bottom}" class="ct-grid" />\n`;
        xLabelsSvg += `<text x="${pt.x}" y="${bottom + 20}" class="ct-label x-label" text-anchor="middle">${idx + 1}</text>\n`;
    });

    // Points SVG
    let pointsSvg = '';
    points.forEach((pt) => {
        pointsSvg += `<circle cx="${pt.x}" cy="${pt.y}" r="4.5" class="ct-point" />\n`;
    });

    return `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect id="cardBg" x="0.5" y="0.5" rx="${radius}" width="${width - 1}" height="${height - 1}" fill="#${bgColor}" stroke="#${borderColor}" stroke-width="1.5" />
    <style>
        .header {
            font: 600 20px 'Segoe UI', Ubuntu, Sans-Serif;
            text-anchor: middle;
            fill: #${titleColor};
        }
        .axis-title {
            font: 600 13px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #${textColor};
            opacity: 0.8;
        }
        .ct-label {
            font: 500 11px 'Segoe UI', Ubuntu, Sans-Serif;
            fill: #${textColor};
            opacity: 0.7;
        }
        .ct-grid {
            stroke: #${textColor};
            stroke-width: 1px;
            stroke-opacity: 0.15;
            stroke-dasharray: 2px 2px;
        }
        .ct-line {
            fill: none;
            stroke: #${lineColor};
            stroke-width: 3.5px;
            stroke-linecap: round;
            stroke-linejoin: round;
            stroke-dasharray: 4000;
            stroke-dashoffset: 4000;
            animation: dash 3.5s ease-in-out forwards;
        }
        .ct-area {
            fill: #${areaColor};
            fill-opacity: 0.12;
        }
        .ct-point {
            fill: #${bgColor};
            stroke: #${pointColor};
            stroke-width: 3px;
            animation: blink 1s ease-in-out forwards;
        }
        @keyframes dash {
            to {
                stroke-dashoffset: 0;
            }
        }
        @keyframes blink {
            from {
                opacity: 0;
                transform: scale(0.5);
                transform-origin: center;
            }
            to {
                opacity: 1;
                transform: scale(1);
            }
        }
    </style>

    <!-- Card Title -->
    <text x="${width / 2}" y="42" class="header">${title}</text>

    <!-- Axis Titles -->
    <text x="35" y="${(top + bottom) / 2}" class="axis-title" text-anchor="middle" transform="rotate(-90 35 ${(top + bottom) / 2})">Contributions</text>
    <text x="${(left + right) / 2}" y="${bottom + 42}" class="axis-title" text-anchor="middle">Days</text>

    <!-- Grid Lines -->
    <g class="grid-group">
        ${gridLinesSvg}
        ${xGridLinesSvg}
    </g>

    <!-- Axis Labels -->
    <g class="labels-group">
        ${yLabelsSvg}
        ${xLabelsSvg}
    </g>

    <!-- Area & Line Chart -->
    <path d="${dArea}" class="ct-area" />
    <path d="${dLine}" class="ct-line" />

    <!-- Data Points -->
    <g class="points-group">
        ${pointsSvg}
    </g>
</svg>
`;
}

// Dark version
const darkSvg = generateGraphSvg({
    bgColor: '0d1117',
    borderColor: '00BFFF',
    textColor: 'c9d1d9',
    titleColor: '00BFFF',
    lineColor: 'FFD700',
    pointColor: '00BFFF',
    areaColor: 'FFD700',
    radius: 15
});

// Light version
const lightSvg = generateGraphSvg({
    bgColor: 'f0fff0',
    borderColor: '32CD32',
    textColor: '333333',
    titleColor: '32CD32',
    lineColor: '32CD32',
    pointColor: '32CD32',
    areaColor: '32CD32',
    radius: 15
});

fs.writeFileSync(path.join(__dirname, '..', 'activity-graph-dark.svg'), darkSvg);
fs.writeFileSync(path.join(__dirname, '..', 'activity-graph-light.svg'), lightSvg);
console.log('Generated activity-graph-dark.svg and activity-graph-light.svg successfully!');
