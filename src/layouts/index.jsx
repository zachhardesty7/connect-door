import React from 'react'
import { Helmet } from 'react-helmet'
import { Link, graphql, navigate, useStaticQuery } from 'gatsby'
import GImage from 'gatsby-image'

import {
  Footer,
  Icon,
  IconGroup,
  Navigation,
} from 'semantic-styled-ui'

import 'semantic-ui-css/semantic.min.css'
import styled, { ThemeProvider, createGlobalStyle } from 'styled-components'
import { defaultColors } from '../constants'

import brandingMedium from '../assets/branding-medium.otf'
import montserratMedium from '../assets/Montserrat-Medium.ttf'
import SFTextReg from '../assets/SF-Pro-Text-Regular.otf'
// import cormorantGaramondReg from '../assets/CormorantGaramond-Regular.ttf'
// import arvoReg from '../assets/Arvo-Regular.ttf'
// import SFReg from '../assets/SF-Pro-Display-Regular.otf'
// import OSReg from '../assets/OpenSans-Regular.ttf'

const GlobalStyle = createGlobalStyle`
  /* logo font */
  @font-face {
    font-family: 'Branding';
    /* stylelint-disable-next-line function-whitespace-after */
    src: url(${brandingMedium}) format('opentype');
    font-display: swap;
  }

  /* heading font - h3-h8 */
  @font-face {
    font-family: 'HeadFont';
    /* stylelint-disable-next-line function-whitespace-after */
    src: url(${SFTextReg}) format('opentype');
    font-display: swap;
    /* font-display: fallback; <- this can be added to each @font-face definition */
  }

  /* body font - p tags */
  @font-face {
    font-family: 'BodyFont';
    /* stylelint-disable-next-line function-whitespace-after */
    src: url(${SFTextReg}) format('opentype');
    font-display: swap;
  }

  /* main font - all but h1, h3-h8, p */
  @font-face {
    font-family: 'RestFont';
    /* stylelint-disable-next-line function-whitespace-after */
    src: url(${montserratMedium}) format('opentype');
    font-display: swap;
  }

  h1 {
    font-family: 'Branding', Tahoma, Arial, Helvetica, sans-serif !important;
  }

  h3, h4, h5, h6 {
    font-family: 'HeadFont', Tahoma, Arial, Helvetica, sans-serif !important;
  }

  p {
    font-family: 'BodyFont', Tahoma, Arial, Helvetica, sans-serif !important;
    font-size: 1.15em;
    line-height: 1.5;
  }

  *:not(.icon):not(h1):not(h3):not(h4):not(h5):not(h6):not(p) {
    font-family: 'RestFont', Tahoma, Arial, Helvetica, sans-serif !important;
  }

  body {
    font-size: 1em;
    margin: 0;
  }

  img {
    display: block;
    width: 100%;
  }

  /* fix semantic-ui bug */
  .ui.corner.label .link.icon {
    cursor: pointer;
  }

  /* fix semantic-ui bug to prevent aligning text to center when using 'centered' grid */
  .ui.centered.grid, .ui.centered.grid>.row, .ui.grid>.centered.row {
    text-align: left;
  }

  /* conditional helper classes, can't be put in SC due to namespace error */
  .clickable:hover {
    cursor: pointer !important;
  }

  .no-overflow {
    overflow: hidden !important;
  }
  .no-overflow-x {
    overflow-x: hidden !important;
  }
  .no-overflow-y {
    overflow-y: hidden !important;
  }

  .no-padding {
    width: 100%;
    height: 100%;
  }
  .no-padding-left {
    padding-left: 0 !important;
  }
  .no-padding-right {
    padding-right: 0 !important;
  }
  .no-padding-top {
    padding-top: 0 !important;
  }
  .no-padding-bottom {
    padding-bottom: 0 !important;
  }
  .no-padding-horizontal {
    padding-left: 0 !important;
    padding-right: 0 !important;
  }
  .no-padding-vertical {
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
  .no-padding-all {
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  }
`

const NavLogo = styled(GImage).attrs()`
  margin-bottom: -3px;
`

const Template = ({ children, location }) => {
  const data = useStaticQuery(graphql`
    {
      sectionNav: contentfulNav(contentful_id: {eq: "3oYma487pKEGoceuYc8WCk"}) {
        sections
        size
        logo {
          title
          fixed(width: 150) {
            ...GatsbyContentfulFixed_tracedSVG
          }
        }
        logoSecondary {
          title
          fixed(width: 150) {
            ...GatsbyContentfulFixed_tracedSVG
          }
        }
      }
    }
  `)

  const { sectionNav } = data

  return (
    <ThemeProvider theme={{ ...defaultColors }}>
      <div id='top' className='root'>

        <Helmet
          defaultTitle='ConnectDoor'
          titleTemplate='ConnectDoor - %s'
        >
          <meta charSet='utf-8' />
          <html lang='en' />
          <meta
            name='Description'
            content={'Progressive Web App to advertise the services of ' +
            'ConnectDoor and contact them on listings'}
          />
          {/* <meta name='keywords' content='Real Estate, Development, Construction, Property'/> */}
          <meta name='author' content='Horatio Villarreal' />
          <meta itemProp='name' content='ConnectDoor' />
          <meta itemProp='url' content='https://theconnectdoor.com/' />
          {/* <meta itemProp='telephone' content='469.560.3010' /> */}
          {/* <meta itemProp='email' content='info@gulfcorpusa.com' /> */}
        </Helmet>

        <GlobalStyle />

        <Navigation
          size={sectionNav.size}
          fullWidth
          relaxed
          noPointing
          floating
          inverted
        >
          <Navigation.Left>
            <Navigation.Logo as={Link} link='/' activeClassName='active'>
              <NavLogo fixed={sectionNav.logoSecondary?.fixed} alt='logo' />
            </Navigation.Logo>
          </Navigation.Left>
          <Navigation.Right>
            {sectionNav.sections.map((page) => (
            // last item is a new page link
              page === 'Properties' ? (
                <Navigation.Item
                  key={page}
                  as={Link}
                  link={`/${page.toLowerCase()}`}
                  activeClassName='active'
                >
                  {page}
                </Navigation.Item>
              ) : (
                <Navigation.Item
                  key={page}
                  onClick={() => location.pathname === '/properties' && navigate(`/#${page}`)}
                  link={location.pathname !== '/properties' ? `#${page}` : ''}
                >
                  {page}
                </Navigation.Item>
              )
            ))}
          </Navigation.Right>
        </Navigation>

        {children}

        <Footer
          inverted
          icons={(
            <IconGroup light justify='flex-end'>
              <Icon name='facebook' link='https://www.facebook.com/theconnectdoor/' />
              <Icon name='twitter' link='https://twitter.com/ConnectDoor/' />
              <Icon name='instagram' link='https://instagram.com/ConnectDoor/' />
              <Icon name='linkedin' link='https://www.linkedin.com/company/connect-door/' />
            </IconGroup>
          )}
          copyright='ConnectDoor'
          developerName='Zach Hardesty'
          developerLink='https://zachhardesty.com'
        />
      </div>
    </ThemeProvider>
  )
}

export default Template
