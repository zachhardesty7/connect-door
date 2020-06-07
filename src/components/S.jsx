import React from 'react'
import styled, { css } from 'styled-components'

const S = {} // SC namespace

S.WithoutPadding = styled.span`
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
`

export const clickable = () => 'clickable'

export const noPadding = (sides) => {
  let classes = 'no-padding'

  if (sides.includes('left')) classes += ' no-padding-left'
  if (sides.includes('right')) classes += ' no-padding-right'
  if (sides.includes('top')) classes += ' no-padding-top'
  if (sides.includes('bottom')) classes += ' no-padding-bottom'

  if (sides.includes('horizontal')) classes += ' no-padding-horizontal'
  if (sides.includes('vertical')) classes += ' no-padding-vertical'

  if (sides.includes('all')) classes += ' no-padding-all'

  return classes
}

export const noOverflow = (dir) => {
  if (dir === 'x') return 'no-overflow-x'
  if (dir === 'y') return 'no-overflow-y'
  return 'no-overflow'
}

export const WithoutPadding = ({ children, ...rest }) => (
  React.Children.map(children, (Child) => (
    <S.WithoutPadding as={Child.type} {...Child.props} {...rest}>
      {Child.props.children}
    </S.WithoutPadding>
  ))
)
