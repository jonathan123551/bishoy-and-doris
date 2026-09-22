/**
 * Centralized Event Configuration
 * ================================
 * Change ALL event details from this single file.
 * Every component reads from this configuration.
 */

import photo01 from '../assets/couple/photo-01.jpg';
import photo02 from '../assets/couple/photo-02.jpg';

export const eventConfig = {
  // Couple Names
  brideName: 'Doris',
  groomName: 'Bishoy',

  // Event Date & Time
  date: '2026-11-14',
  time: '17:00',
  displayDate: '14 November 2026',
  displayDay: 'Saturday',
  displayTime: '5:00 PM',

  // Ceremony
  church: {
    name: 'Church of Archangel Michael',
    arabicName: 'كنيسة رئيس الملائكة ميخائيل',
    arabicFullName: 'كنيسة رئيس الملائكة ميخائيل بالشيراتون',
    area: 'Sheraton',
    city: 'Cairo',
    mapLabel: 'View on Google Maps',
    mapUrl: 'https://maps.app.goo.gl/8on9xhmV9xnS9zPG7?g_st=ic',
  },

  // Reception
  reception: {
    name: 'La Pensée',
    area: 'Gardenia',
    note: 'After the ceremony',
    childrenNote: 'We kindly request that children remain seated with their parents',
    mapLabel: 'View on Google Maps',
    mapUrl: 'https://maps.app.goo.gl/SMVCau5jSZhje6fh7?g_st=ic',
  },

  // Add an authentic Bishoy and Doris video here when it is available.
  introVideo: null,

  // Couple Photos
  couplePhotos: [
    {
      src: photo01,
      alt: 'Bishoy and Doris',
      orientation: 'portrait',
      objectPositionMobile: '50% 35%',
      objectPositionDesktop: '50% 40%',
    },
    {
      src: photo02,
      alt: 'Bishoy and Doris',
      orientation: 'portrait',
      objectPositionMobile: '50% 30%',
      objectPositionDesktop: '50% 35%',
    },
  ],

  // Meta / SEO
  meta: {
    title: 'Bishoy & Doris — 14 November 2026',
    description:
      'You are invited to celebrate the wedding of Bishoy and Doris. 14 November 2026 at 5:00 PM.',
    ogImage: '/og-image.jpg',
    themeColor: '#0B0A09',
  },
};
