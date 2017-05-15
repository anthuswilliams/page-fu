module.exports = [
  {
    match: { by: 'url', on: '*' },
    regions: [
      {
        name: 'Layout::Content',
        options: { framed: true },
        outlets: [
          {
            name: 'Markdown::Document',
            using: 'articles',
            match: {
              by: 'namespace',
              on: 'articles'
            }
          },
          {
            name: 'CJS::Module',
            match: {
              by: 'namespace',
              on: 'js'
            }
          },
          {
            name: 'CJS::NamespaceIndex',
            match: {
              by: 'namespace',
              on: 'js'
            }
          },
        ]
      },

      {
        name: 'Layout::Sidebar',
        outlets: [
          {
            name: 'Markdown::Browser',
            using: 'articles'
          },
          {
            name: 'Layout::SidebarHeader',
            options: {
              text: 'API'
            }
          },
          {
            name: 'CJS::ClassBrowser',
            using: 'js',
          },

          {
            name: 'Layout::SidebarSearch',
            options: {
              text: 'Search'
            }
          },
        ]
      },
    ]
  }
];