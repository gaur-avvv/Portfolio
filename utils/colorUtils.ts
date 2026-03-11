
export const hexToRgb = (hex: string) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

export const rgbToHex = (r: number, g: number, b: number) => {
  return "#" + ((1 << 24) + (Math.round(r) << 16) + (Math.round(g) << 8) + Math.round(b)).toString(16).slice(1);
};

export const interpolateColor = (color1: string, color2: string, factor: number) => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  const r = rgb1.r + factor * (rgb2.r - rgb1.r);
  const g = rgb1.g + factor * (rgb2.g - rgb1.g);
  const b = rgb1.b + factor * (rgb2.b - rgb1.b);
  
  return rgbToHex(r, g, b);
};
