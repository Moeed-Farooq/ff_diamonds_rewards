import React from 'react';
import Svg, { G, Path, Text as SvgText } from 'react-native-svg';

const toRadians = deg => (Math.PI / 180) * deg;

const polarToCartesian = (cx, cy, r, angleInDegrees) => {
  const radians = toRadians(angleInDegrees);
  return {
    x: cx + r * Math.cos(radians),
    y: cy + r * Math.sin(radians),
  };
};

const describeArcSlice = (cx, cy, r, start, end) => {
  const startPoint = polarToCartesian(cx, cy, r, end);
  const endPoint = polarToCartesian(cx, cy, r, start);
  const largeArc = end - start <= 180 ? 0 : 1;
  return `M ${cx} ${cy} L ${startPoint.x} ${startPoint.y} A ${r} ${r} 0 ${largeArc} 0 ${endPoint.x} ${endPoint.y} Z`;
};

const SpinWheelGraphic = ({ size, rewards, segmentColors, textStyle, center, radiusCircle }) => {
  const segment = 360 / rewards.length;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      {rewards.map((reward, index) => {
        const start = -90 + index * segment;
        const end = start + segment;
        const labelAngle = start + segment / 2;
        const labelPoint = polarToCartesian(center, center, radiusCircle * 0.56, labelAngle);

        return (
          <G key={`${reward}`}>
            <Path
              d={describeArcSlice(center, center, radiusCircle, start, end)}
              fill={segmentColors[index % segmentColors.length]}
            />
            <SvgText
              x={labelPoint.x}
              y={labelPoint.y}
              fill={textStyle.fill}
              fontSize={textStyle.fontSize}
              fontFamily={textStyle.fontFamily}
              textAnchor="middle"
              alignmentBaseline="middle"
              rotation={labelAngle + 90}
              origin={`${labelPoint.x}, ${labelPoint.y}`}
            >
              {reward}
            </SvgText>
          </G>
        );
      })}
    </Svg>
  );
};

export default SpinWheelGraphic;
