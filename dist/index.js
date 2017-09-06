'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _reactNative = require('react-native');

var _reactSyntaxHighlighter = require('react-syntax-highlighter');

var _reactSyntaxHighlighter2 = _interopRequireDefault(_reactSyntaxHighlighter);

var _createElement = require('react-syntax-highlighter/dist/create-element');

var _styles = require('react-syntax-highlighter/dist/styles');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _objectWithoutProperties(obj, keys) { var target = {}; for (var i in obj) { if (keys.indexOf(i) >= 0) continue; if (!Object.prototype.hasOwnProperty.call(obj, i)) continue; target[i] = obj[i]; } return target; }

var styleCache = new Map();

function generateNewStylesheet(stylesheet) {
  if (styleCache.has(stylesheet)) {
    return styleCache.get(stylesheet);
  }
  var transformedStyle = Object.entries(stylesheet).reduce(function (newStylesheet, _ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        className = _ref2[0],
        style = _ref2[1];

    newStylesheet[className] = Object.entries(style).reduce(function (newStyle, _ref3) {
      var _ref4 = _slicedToArray(_ref3, 2),
          key = _ref4[0],
          value = _ref4[1];

      if (key === 'overflowX') {
        newStyle.overflow = value === 'auto' ? 'scroll' : value;
      } else if (value.includes('em')) {
        var _value$split = value.split('em'),
            _value$split2 = _slicedToArray(_value$split, 1),
            num = _value$split2[0];

        newStyle[key] = Number(num) * 16;
      } else if (key === 'background') {
        newStyle.backgroundColor = value;
      } else if (key === 'display') {
        return newStyle;
      } else {
        newStyle[key] = value;
      }
      return newStyle;
    }, {});
    return newStylesheet;
  }, {});
  var defaultColor = transformedStyle.hljs && transformedStyle.hljs.color || '#000';
  if (transformedStyle.hljs && transformedStyle.hljs.color) {
    delete transformedStyle.hljs.color;
  }
  styleCache.set(stylesheet, { transformedStyle: transformedStyle, defaultColor: defaultColor });
  return { transformedStyle: transformedStyle, defaultColor: defaultColor };
}

function createChildren(_ref5) {
  var stylesheet = _ref5.stylesheet,
      fontSize = _ref5.fontSize,
      fontFamily = _ref5.fontFamily;

  var childrenCount = 0;
  return function (children, defaultColor) {
    childrenCount += 1;
    return children.map(function (child, i) {
      return createNativeElement({
        node: child,
        stylesheet: stylesheet,
        key: 'code-segment-' + childrenCount + '-' + i,
        defaultColor: defaultColor,
        fontSize: fontSize,
        fontFamily: fontFamily
      });
    });
  };
}

function createNativeElement(_ref6) {
  var node = _ref6.node,
      stylesheet = _ref6.stylesheet,
      key = _ref6.key,
      defaultColor = _ref6.defaultColor,
      fontFamily = _ref6.fontFamily,
      _ref6$fontSize = _ref6.fontSize,
      fontSize = _ref6$fontSize === undefined ? 12 : _ref6$fontSize;
  var properties = node.properties,
      type = node.type,
      TagName = node.tagName,
      value = node.value;

  var startingStyle = { fontFamily: fontFamily, fontSize: fontSize, height: fontSize + 2 };
  if (type === 'text') {
    return _react2.default.createElement(
      _reactNative.Text,
      {
        key: key,
        style: Object.assign({ color: defaultColor }, startingStyle)
      },
      value
    );
  } else if (TagName) {
    var childrenCreator = createChildren({ stylesheet: stylesheet, fontSize: fontSize, fontFamily: fontFamily });
    var style = (0, _createElement.createStyleObject)(properties.className, Object.assign({ color: defaultColor }, properties.style, startingStyle), stylesheet);
    var children = childrenCreator(node.children, style.color || defaultColor);
    return _react2.default.createElement(
      _reactNative.Text,
      { key: key, style: style },
      children
    );
  }
}

function nativeRenderer(_ref7) {
  var defaultColor = _ref7.defaultColor,
      fontFamily = _ref7.fontFamily,
      fontSize = _ref7.fontSize;

  return function (_ref8) {
    var rows = _ref8.rows,
        stylesheet = _ref8.stylesheet;
    return rows.map(function (node, i) {
      return createNativeElement({
        node: node,
        stylesheet: stylesheet,
        key: 'code-segment-' + i,
        defaultColor: defaultColor,
        fontFamily: fontFamily,
        fontSize: fontSize
      });
    });
  };
}

function NativeSyntaxHighlighter(_ref9) {
  var fontFamily = _ref9.fontFamily,
      fontSize = _ref9.fontSize,
      style = _ref9.style,
      children = _ref9.children,
      rest = _objectWithoutProperties(_ref9, ['fontFamily', 'fontSize', 'style', 'children']);

  var _generateNewStyleshee = generateNewStylesheet(style),
      transformedStyle = _generateNewStyleshee.transformedStyle,
      defaultColor = _generateNewStyleshee.defaultColor;

  return _react2.default.createElement(
    _reactSyntaxHighlighter2.default,
    _extends({}, rest, {
      style: transformedStyle,
      horizontal: true,
      renderer: nativeRenderer({
        defaultColor: defaultColor,
        fontFamily: fontFamily,
        fontSize: fontSize
      })
    }),
    children
  );
}

NativeSyntaxHighlighter.defaultProps = {
  fontFamily: _reactNative.Platform.OS === 'ios' ? 'Menlo-Regular' : 'monospace',
  fontSize: 12,
  style: _styles.defaultStyle,
  PreTag: _reactNative.ScrollView,
  CodeTag: _reactNative.ScrollView
};

exports.default = NativeSyntaxHighlighter;