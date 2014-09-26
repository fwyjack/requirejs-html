html
====

A [RequireJS](http://requirejs.org)/AMD loader plugin for HTML source files.  Depends on the RequireJS [text](https://github.com/requirejs/text) plugin.

## Installation

The plugin is easily installed with [bower](http://bower.io/):

```
bower install requirejs-html
```

## Usage

Just as RequireJS adds the ".js" extension for JavaScript files, html automatically appends ".html" to the given path.

```JavaScript
define(['html!app/templates/main'], function(template) {
  // template is a string containing the contents of app/templates/main.html
});
```

## Configuration

The html plugin offers several configuration options for minifying HTML source files before they are passed to a module:

### comments
Set to `strip` to remove all comments from the HTML source, or `preserve` to leave the comments intact.

### whitespaceBetweenTags
Targets sequences of whitespace characters (including newlines) that separate adjacent tags.  Set to `collapse` to condense the whitespace down to a single space (`0x20`) character, `strip` to remove the whitespace completely, or `preserve` to leave the whitespace as-is.

### whitespaceBetweenTagsAndText
Targets sequences of whitespace characters that separate tags from printable text.  Set to `collapse` to condense the whitespace down to a single space (`0x20`) character, `strip` to remove the whitespace completely, or `preserve` to leave the whitespace as-is.

### whitespaceWithinTags
Targets sequences of two or more whitespace characters that occur between the attributes of a tag.  Set to `collapse` to condense the whitespace down to a single space (`0x20`) character, or `preserve` to leave the whitespace as-is.

## License

This plugin is released under the [MIT license](LICENSE).
