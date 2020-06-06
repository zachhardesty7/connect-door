import React from 'react'
import styled, { css } from 'styled-components'

const S = {} // SC namespace

S.WithoutPadding = styled.span`
  /* &>*:first-child { */
  width: 100%;
  height: 100%;

  ${({ $left }) => $left && css`padding-left: 0 !important;`};
  ${({ $right }) => $right && css`padding-right: 0 !important;`};
  ${({ $top }) => $top && css`padding-top: 0 !important;`};
  ${({ $bottom }) => $bottom && css`padding-bottom: 0 !important;`};

  ${({ $horizontal }) => $horizontal && css`
    padding-left: 0 !important;
    padding-right: 0 !important;
  `};

  ${({ $vertical }) => $vertical && css`
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  `};

  ${({ $all }) => $all && css`
    padding-left: 0 !important;
    padding-right: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 0 !important;
  `};
/* } */

`

// export const WithoutPadding = (children, ...rest) => (
//   React.Children.map(children, (Child) => <S.WithoutPadding as={Child} {...rest} />)
// )
export const WithoutPadding = ({ children, ...rest }) => (
  React.Children.map(children, (Child) => (
    <S.WithoutPadding as={Child.type} {...Child.props} {...rest}>
      {Child.props.children}
    </S.WithoutPadding>
  ))
)
