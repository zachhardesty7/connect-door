let contentfulConfig

try {
  // Load the Contentful config from the .contentful.json
  contentfulConfig = require('./.contentful') // eslint-disable-line global-require
} catch (_) { console.info('using env vars') }

// Overwrite the Contentful config with environment variables if they exist
contentfulConfig = {
  spaceId: process.env.CONTENTFUL_SPACE_ID || contentfulConfig.spaceId,
  accessToken: process.env.CONTENTFUL_DELIVERY_TOKEN || contentfulConfig.accessToken,
}

const { spaceId, accessToken } = contentfulConfig

if (!spaceId || !accessToken) {
  throw new Error(
    'Contentful spaceId and the delivery token need to be provided.',
  )
}

module.exports = {
  siteMetadata: {
    siteUrl: 'https://theconnectdoor.com',
  },
  plugins: [
    {
      resolve: 'gatsby-plugin-manifest',
      options: {
        name: 'ConnectDoor',
        short_name: 'ConnectDoor',
        start_url: '/',
        background_color: '#3B5998',
        theme_color: '#3B5998',
        display: 'standalone',
        icon: './src/assets/cd-logo-icon-blue.svg',
        include_favicon: true,
      },
    },
    {
      resolve: 'gatsby-plugin-google-analytics',
      options: {
        trackingId: 'UA-127721122-1',
        // Setting this parameter is also optional
        respectDNT: true,
      },
    },
    'gatsby-plugin-sitemap',
    {
      resolve: 'gatsby-plugin-webpack-bundle-analyzer',
      options: {
        // production: true,
        openAnalyzer: false,
      },
    },
    'gatsby-plugin-offline',
    {
      resolve: 'gatsby-plugin-styled-components',
      options: {
        pure: process.env.NODE_ENV !== 'local',
        fileName: process.env.NODE_ENV === 'local',
        displayName: process.env.NODE_ENV === 'local',
      },
    },
    'gatsby-plugin-react-helmet',
    {
      resolve: 'gatsby-source-contentful',
      options: contentfulConfig,
    },
    'gatsby-plugin-netlify',
  ],
}
