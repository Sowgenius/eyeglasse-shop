/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'fr',
    locales: ['fr', 'en'],
  },
  localePath: require('path').resolve('./public/locales'),
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
