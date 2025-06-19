import { Dimensions, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

const guidelineBaseWidth = 430;
const guidelineBaseHeight = 932;

const horizontalScale = (size: number): number => {
  return Math.ceil((width / guidelineBaseWidth) * size);
};

const verticalScale = (size: number): number => {
  return Math.ceil((height / guidelineBaseHeight) * size);
};

const moderateScale = (size: number, factor = 1): number => {
  return Math.ceil(size + (horizontalScale(size) - size) * factor);
};

const moderateVerticalScale = (size: number, factor = 1): number => {
  return Math.ceil(size + (verticalScale(size) - size) * factor);
};

const fontScale = (size: number): number => {
  return (width / guidelineBaseWidth) * size;
};

const lineHeight = (size: number): number => {
  return (width / guidelineBaseWidth) * size * 1.25;
};

const rupeeHeight = (size: number): number => {
  return (12 / 18) * lineHeight(size);
};

const rupeeWidth = (size: number): number => {
  return (8 / 12) * rupeeHeight(size);
};

export default {
  fontScale,
  moderateScale,
  moderateVerticalScale,
  horizontalScale,
  verticalScale,
  lineHeight,
  rupeeHeight,
  rupeeWidth
};
