/**
 * THE BRUNEL ENGINE — Art Deco Decorative Elements
 *
 * These SVG components create the geometric ornamentation
 * that gives the app its Art Deco character. Every element
 * is drawn from authentic Deco motifs:
 *
 * - Sunburst: radiating lines symbolizing optimism and progress
 * - Chevron: the stepped/ziggurat pattern of Deco architecture
 * - Fan: the palmette/fountain motif from Deco interiors
 * - Divider: ornamental line separators with geometric centers
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import Svg, { Line, Path, Circle, Rect, G } from 'react-native-svg';
import { colors } from '../theme/colors';

/**
 * Horizontal divider with a central diamond motif.
 * Like the brass inlay strips in an Art Deco elevator lobby.
 */
export const DecoDivider: React.FC<{
  width?: number;
  color?: string;
  style?: any;
}> = ({ width = 280, color = colors.gold, style }) => (
  <View style={[styles.centered, style]}>
    <Svg width={width} height={20} viewBox={`0 0 ${width} 20`}>
      {/* Left line */}
      <Line
        x1={0} y1={10} x2={width / 2 - 16} y2={10}
        stroke={color} strokeWidth={1} opacity={0.6}
      />
      {/* Central diamond */}
      <Path
        d={`M${width / 2} 2 L${width / 2 + 8} 10 L${width / 2} 18 L${width / 2 - 8} 10 Z`}
        fill="none" stroke={color} strokeWidth={1.5}
      />
      <Path
        d={`M${width / 2} 5 L${width / 2 + 5} 10 L${width / 2} 15 L${width / 2 - 5} 10 Z`}
        fill={color} opacity={0.3}
      />
      {/* Right line */}
      <Line
        x1={width / 2 + 16} y1={10} x2={width} y2={10}
        stroke={color} strokeWidth={1} opacity={0.6}
      />
    </Svg>
  </View>
);

/**
 * Corner ornament — stepped geometric bracket.
 * Place in corners of cards and panels for that Deco framing effect.
 */
export const DecoCorner: React.FC<{
  size?: number;
  color?: string;
  rotation?: number;
  style?: any;
}> = ({ size = 24, color = colors.gold, rotation = 0, style }) => (
  <View style={[{ transform: [{ rotate: `${rotation}deg` }] }, style]}>
    <Svg width={size} height={size} viewBox="0 0 24 24">
      <Path
        d="M0 0 L24 0 L24 4 L4 4 L4 24 L0 24 Z"
        fill="none" stroke={color} strokeWidth={1.5}
      />
      <Path
        d="M0 0 L12 0 L12 2 L2 2 L2 12 L0 12 Z"
        fill={color} opacity={0.2}
      />
    </Svg>
  </View>
);

/**
 * Sunburst motif — radiating lines from a central point.
 * The quintessential Art Deco symbol of progress and dawn.
 */
export const DecoSunburst: React.FC<{
  size?: number;
  color?: string;
  rays?: number;
  style?: any;
}> = ({ size = 120, color = colors.gold, rays = 12, style }) => {
  const center = size / 2;
  const innerRadius = size * 0.12;
  const outerRadius = size * 0.45;

  const lines = Array.from({ length: rays }, (_, i) => {
    const angle = (i * Math.PI * 2) / rays - Math.PI / 2;
    return (
      <Line
        key={i}
        x1={center + Math.cos(angle) * innerRadius}
        y1={center + Math.sin(angle) * innerRadius}
        x2={center + Math.cos(angle) * outerRadius}
        y2={center + Math.sin(angle) * outerRadius}
        stroke={color}
        strokeWidth={i % 3 === 0 ? 2 : 1}
        opacity={i % 3 === 0 ? 0.8 : 0.4}
      />
    );
  });

  return (
    <View style={[styles.centered, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {lines}
        <Circle cx={center} cy={center} r={innerRadius - 2} fill="none" stroke={color} strokeWidth={1.5} />
        <Circle cx={center} cy={center} r={3} fill={color} />
      </Svg>
    </View>
  );
};

/**
 * Stepped chevron bar — the ziggurat pattern.
 * Used as section headers, like the stepped crown of the Chrysler Building.
 */
export const DecoChevronBar: React.FC<{
  width?: number;
  color?: string;
  style?: any;
}> = ({ width = 300, color = colors.gold, style }) => {
  const mid = width / 2;
  return (
    <View style={[styles.centered, style]}>
      <Svg width={width} height={16} viewBox={`0 0 ${width} 16`}>
        {/* Outer chevron */}
        <Path
          d={`M0 14 L${mid} 2 L${width} 14`}
          fill="none" stroke={color} strokeWidth={1} opacity={0.4}
        />
        {/* Inner chevron */}
        <Path
          d={`M${width * 0.15} 14 L${mid} 5 L${width * 0.85} 14`}
          fill="none" stroke={color} strokeWidth={1.5} opacity={0.7}
        />
        {/* Center dot */}
        <Circle cx={mid} cy={4} r={2} fill={color} opacity={0.8} />
      </Svg>
    </View>
  );
};

/**
 * Fan/palmette motif — Art Deco's organic geometric form.
 * The stylized fan shape found in Deco grillwork and facades.
 */
export const DecoFan: React.FC<{
  size?: number;
  color?: string;
  style?: any;
}> = ({ size = 80, color = colors.gold, style }) => {
  const center = size / 2;
  const fanLines = 7;

  const paths = Array.from({ length: fanLines }, (_, i) => {
    const startAngle = Math.PI * 0.15;
    const endAngle = Math.PI * 0.85;
    const angle = startAngle + (i * (endAngle - startAngle)) / (fanLines - 1);
    const radius = size * 0.42;
    return (
      <Line
        key={i}
        x1={center}
        y1={size * 0.85}
        x2={center + Math.cos(angle + Math.PI) * radius}
        y2={size * 0.85 + Math.sin(angle + Math.PI) * radius}
        stroke={color}
        strokeWidth={i === Math.floor(fanLines / 2) ? 2 : 1}
        opacity={0.5 + (i === Math.floor(fanLines / 2) ? 0.3 : 0)}
      />
    );
  });

  return (
    <View style={[styles.centered, style]}>
      <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        {paths}
        {/* Base line */}
        <Line
          x1={size * 0.2} y1={size * 0.85}
          x2={size * 0.8} y2={size * 0.85}
          stroke={color} strokeWidth={2}
        />
      </Svg>
    </View>
  );
};

/**
 * Framed card wrapper with Art Deco corner accents.
 * Wraps content in a bordered panel with stepped corners.
 */
export const DecoFrame: React.FC<{
  children: React.ReactNode;
  style?: any;
}> = ({ children, style }) => (
  <View style={[styles.frame, style]}>
    <DecoCorner style={styles.cornerTL} rotation={0} size={20} />
    <DecoCorner style={styles.cornerTR} rotation={90} size={20} />
    <DecoCorner style={styles.cornerBL} rotation={270} size={20} />
    <DecoCorner style={styles.cornerBR} rotation={180} size={20} />
    <View style={styles.frameContent}>
      {children}
    </View>
  </View>
);

const styles = StyleSheet.create({
  centered: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  frame: {
    borderWidth: 1,
    borderColor: colors.graphite,
    backgroundColor: colors.charcoal,
    borderRadius: 4,
    position: 'relative',
    overflow: 'visible',
  },
  frameContent: {
    padding: 20,
  },
  cornerTL: { position: 'absolute', top: -2, left: -2 },
  cornerTR: { position: 'absolute', top: -2, right: -2 },
  cornerBL: { position: 'absolute', bottom: -2, left: -2 },
  cornerBR: { position: 'absolute', bottom: -2, right: -2 },
});
