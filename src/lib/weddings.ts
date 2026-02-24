export interface Wedding {
  readonly slug: string;
  readonly name: string;
  readonly caption: string;
  readonly galleryCount: number;
}

export const weddings: readonly Wedding[] = [
  {
    slug: 'adri-david',
    name: 'Adri & Dávid',
    caption:
      'Szárazvirágból készült teljes dekoráció, amely a végtelenségig megőrzi az esküvő napjának gyönyörű emlékét.',
    galleryCount: 4,
  },
  {
    slug: 'reka-balint',
    name: 'Réka & Bálint',
    caption: 'Amilyen a pár, olyan a csokor. Vidám, sokszínű, élénk.',
    galleryCount: 7,
  },
  {
    slug: 'anna-bence',
    name: 'Anna & Bence',
    caption: 'Méhlegelő ihletésű csokor, novemberi kivitelben.',
    galleryCount: 0,
  },
  {
    slug: 'dori-david',
    name: 'Dóri & Dávid',
    caption: 'Rusztikus sítlusú, természetközeli dekor, az ősz színeivel.',
    galleryCount: 6,
  },
];

export function getWeddingBySlug(slug: string): Wedding | undefined {
  return weddings.find((wedding) => wedding.slug === slug);
}

