const path = require('path')

const transformUrl = (url) => {
  if (!url.startsWith('/')) {
    url = '/' + url
  }
  if (url.endsWith('.js')) {
    url = url.substr(0, url.length - 3)
  }
  if (url.endsWith('/index')) {
    url = url.substr(0, url.length - 5)
  }
  if (!url.endsWith('/')) {
    url += '/'
  }

  return url
}

const createRouterMatch = (paths) => (pagePath) => {
  return {
    createComponent: `
      asyncPages[${JSON.stringify(pagePath)}] = createAsyncComponent({
        resolve: () => System.import(${JSON.stringify(pagePath)})
      })
    `,
    match: `
      <Route
        exact
        path={${JSON.stringify(transformUrl(path.relative(paths.contentPath, pagePath)))}}
        render={({match}) => {
          const Page = asyncPages[${JSON.stringify(pagePath)}]
          return <Page match={match} />
        }}
      />
    `,
    path: pagePath
  }
}

module.exports = createRouterMatch
