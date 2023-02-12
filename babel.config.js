module.exports = {
  presets: [
    'babel-preset-gatsby',
  ],
  plugins: [
    // FIXME: breaks library styling
    // 'babel-plugin-transform-semantic-ui-react-style-imports',
    [
      '@quickbaseoss/babel-plugin-styled-components-css-namespace',
      {
        cssNamespace: '.root.root.root',
      },
    ],
  ],
}
