/** @type {import('next-seo').DefaultSeoProps} */
// seo setup
export default {
  defaultTitle: 'A Bit of Personal Space - an exploration.',
  titleTemplate: '%s - a bit of personal space',
  description: 'An exporation into the spaces and places that make us us.',
  canonical: 'https://abitofpersonal.space',
  additionalMetaTags: [
    {
      property: 'author',
      content: 'Evan Kirkiles',
    },
    {
      property: 'language',
      content: 'en-us',
    },
    {
      property: 'keywords',
      content:
        'art, artist, painting, paper, papercraft, papercrafting, scissors, cut, glue, fold, visuals, graphic design, blender, 3d, 2d, concept, sculpture, game, video, videogame',
    },
  ],
  openGraph: {
    type: 'website',
    locale: 'en',
    url: 'https://abitofpersonal.space',
    title: 'A Bit of Personal Space - an exploration.',
    description: 'an exporation into the spaces and places that make us us.',
    site_name: 'A Bit of Personal Space',
  },
};
