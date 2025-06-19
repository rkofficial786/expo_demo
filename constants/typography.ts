import sizer from '@/utils/sizer';

export const Typography = {
  fonts: {
    regular: 'Poppins-Regular',
    medium: 'Poppins-Medium',
    semiBold: 'Poppins-SemiBold',
    bold: 'Poppins-Bold',
  },
  sizes: {
    xs: sizer.fontScale(12),
    sm: sizer.fontScale(14),
    md: sizer.fontScale(16),
    lg: sizer.fontScale(18),
    xl: sizer.fontScale(20),
    xxl: sizer.fontScale(24),
    xxxl: sizer.fontScale(32),
  },
  lineHeights: {
    xs: sizer.lineHeight(12),
    sm: sizer.lineHeight(14),
    md: sizer.lineHeight(16),
    lg: sizer.lineHeight(18),
    xl: sizer.lineHeight(20),
    xxl: sizer.lineHeight(24),
    xxxl: sizer.lineHeight(32),
  }
};

export type FontSize = keyof typeof Typography.sizes;
export type FontFamily = keyof typeof Typography.fonts;