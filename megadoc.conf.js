const path = require('path');

module.exports = {
  outputDir: path.resolve(__dirname, 'doc/compiled'),
  assetRoot: path.resolve(__dirname),
  strict: false,
  serializer: [ 'megadoc-html-serializer', {
    theme: [ 'megadoc-theme-qt', {} ],
    title: 'page-fu',
    resizableSidebar: false,
    favicon: null,
    metaDescription: 'page.js routing sugars',
    footer: 'Crafted with &#9829; using <a href="https://github.com/megadoc">megadoc</a>.',
    tooltipPreviews: false,
    styleSheet: path.resolve(__dirname, 'megadoc.less'),
    styleOverrides: {
      'banner-height': 0,
      'accent': '#2aa198',
    },
    redirect: {
      '/index.html': '/readme.html',
    },
    layoutOptions: {
      customLayouts: require('./doc/layout'),
    },
    notFoundComponent: path.resolve(__dirname, 'doc/pages/404.js'),
  }],

  sources: [
    {
      id: 'js',
      include: [ 'src/*.js' ],
      processor: [ 'megadoc-plugin-js', {
        showSourcePaths: false,
        strict: false,
        builtInTypes: [
          {
            name: 'page.Context',
            href: 'https://visionmedia.github.io/page.js/#context'
          }
        ]
      }]
    },
    {
      id: 'md',
      include: [ 'README.md', 'doc/testing.md', 'CHANGELOG.md', ],
      processor: [ 'megadoc-plugin-markdown', {
        baseURL: '/',
        strict: false,
      }]
    }
  ]
}