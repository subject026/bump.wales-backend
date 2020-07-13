module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
    jest: true,
  },
  extends: ["airbnb-base"],
  parserOptions: {
    ecmaVersion: 11,
  },
  rules: {
    indent: 0,
    string: {
      allowTemplateLiterals: true,
    },
  },
};
