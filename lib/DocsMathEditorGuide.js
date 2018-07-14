'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _keys = require('babel-runtime/core-js/object/keys');

var _keys2 = _interopRequireDefault(_keys);

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

var _DocsHelpers = require('./DocsHelpers');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var DocsMathEditorGuide = function (_React$PureComponent) {
  (0, _inherits3.default)(DocsMathEditorGuide, _React$PureComponent);

  function DocsMathEditorGuide() {
    (0, _classCallCheck3.default)(this, DocsMathEditorGuide);
    return (0, _possibleConstructorReturn3.default)(this, (DocsMathEditorGuide.__proto__ || (0, _getPrototypeOf2.default)(DocsMathEditorGuide)).apply(this, arguments));
  }

  (0, _createClass3.default)(DocsMathEditorGuide, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'div',
        { className: 'docs-math-editor-guide-table-container' },
        _react2.default.createElement(
          'div',
          null,
          'Start typing the name of a mathematical function to automatically insert it. (For example, "sqrt" for root, "mat" for matrix, or "defi" for definite integral.)'
        ),
        this._renderSymbolsGuide(),
        this._renderControlsGuide()
      );
    }
  }, {
    key: '_renderControlsGuide',
    value: function _renderControlsGuide() {
      var lines = {
        'left/right arrows': 'Move cursor',
        'shift+left/right arrows': 'Select region',
        'ctrl+a': 'Select all',
        'ctrl+x/c/v': 'Cut/copy/paste',
        'ctrl+z/y': 'Undo/redo',
        'ctrl+left/right': 'Add entry to list or column to matrix',
        'shift+ctrl+left/right': 'Add copy of current entry/column to to list/matrix',
        'ctrl+up/down': 'Add row to matrix',
        'shift+ctrl+up/down': 'Add copy of current row to matrix',
        'ctrl+backspace': 'Delete current entry in list or column in matrix',
        'ctrl+shift+backspace': 'Delete current row in matrix'
      };
      var rows = (0, _keys2.default)(lines).sort().reduce(function (memo, key) {
        memo.push(_react2.default.createElement(
          'tr',
          { key: 'row-control-' + key },
          _react2.default.createElement(
            'th',
            { className: 'docs-math-editor-guide-th' },
            key
          ),
          _react2.default.createElement(
            'td',
            { className: 'docs-math-editor-guide-td' },
            lines[key]
          )
        ));
        return memo;
      }, []);

      return _react2.default.createElement(
        'table',
        { className: 'docs-math-editor-guide-table' },
        _react2.default.createElement(
          'caption',
          null,
          'Controls'
        ),
        _react2.default.createElement(
          'thead',
          null,
          _react2.default.createElement(
            'tr',
            { key: 'first' },
            _react2.default.createElement(
              'th',
              { className: 'docs-math-editor-guide-th' },
              'Press...'
            ),
            _react2.default.createElement(
              'th',
              { className: 'docs-math-editor-guide-th' },
              '...to do'
            )
          )
        ),
        _react2.default.createElement(
          'tbody',
          null,
          rows
        )
      );
    }
  }, {
    key: '_renderSymbolsGuide',
    value: function _renderSymbolsGuide() {
      var symbolsGuide = this.props.symbolsGuide;

      var rows = (0, _keys2.default)(symbolsGuide).sort().reduce(function (memo, key) {
        var html = (0, _DocsHelpers.renderLatexAsHTML)(String(symbolsGuide[key]));
        memo.push(_react2.default.createElement(
          'tr',
          { key: 'row-symbol-' + key },
          _react2.default.createElement(
            'th',
            { className: 'docs-math-editor-guide-th' },
            key
          ),
          _react2.default.createElement(
            'td',
            { className: 'docs-math-editor-guide-td' },
            _react2.default.createElement('div', { dangerouslySetInnerHTML: { __html: html } })
          )
        ));
        return memo;
      }, []);

      return _react2.default.createElement(
        'section',
        null,
        _react2.default.createElement(
          'table',
          { className: 'docs-math-editor-guide-table' },
          _react2.default.createElement(
            'caption',
            null,
            'Symbols'
          ),
          _react2.default.createElement(
            'thead',
            null,
            _react2.default.createElement(
              'tr',
              { key: 'first' },
              _react2.default.createElement(
                'th',
                { className: 'docs-math-editor-guide-th' },
                'Type...'
              ),
              _react2.default.createElement(
                'th',
                { className: 'docs-math-editor-guide-th' },
                '...to get'
              )
            )
          ),
          _react2.default.createElement(
            'tbody',
            null,
            rows
          )
        )
      );
    }
  }]);
  return DocsMathEditorGuide;
}(_react2.default.PureComponent);

exports.default = DocsMathEditorGuide;