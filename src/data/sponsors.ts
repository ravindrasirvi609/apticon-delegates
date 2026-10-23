import type { ImageSourcePropType } from 'react-native';

export interface Sponsor {
  name: string;
  logo: ImageSourcePropType;
}

/** Institutions partnering with APTICON 2026 (mirrors the website's "Co-Associates" marquee). */
export const CO_ASSOCIATES: Sponsor[] = [
  { name: 'Rungta International Skills University', logo: require('../../assets/sponsors/rungta.png') },
  { name: 'Columbia Professional University', logo: require('../../assets/sponsors/columbia.png') },
  { name: 'NIMS University, Jaipur', logo: require('../../assets/sponsors/nims.png') },
  { name: 'SAGE University', logo: require('../../assets/sponsors/sage.png') },
  { name: 'Gracious College of Pharmacy', logo: require('../../assets/sponsors/gracious.png') },
  { name: 'Shri Shankaracharya Professional University', logo: require('../../assets/sponsors/shankaracharya.png') },
  { name: 'D Y Patil University, Navi Mumbai', logo: require('../../assets/sponsors/dy-patil.png') },
  { name: 'Shri Davara University', logo: require('../../assets/sponsors/davara.png') },
  { name: 'Sri Aurobindo Institute of Pharmacy', logo: require('../../assets/sponsors/sri-aurobindo.png') },
  {
    name: 'Bureau for Experiential Pharmacy Education Status Upliftment',
    logo: require('../../assets/sponsors/bureau-experiential.jpeg'),
  },
];

export const POWERED_BY: Sponsor[] = [
  { name: 'Operant Pharmacy Federation', logo: require('../../assets/sponsors/opf.jpg') },
  { name: 'GPAT Discussion Center', logo: require('../../assets/sponsors/gpat.png') },
];
