define(['text'], function(textPlugin) {
	
	var buildText = {};
	
	return {
		
		load: function(name, req, onLoad, config) {
			var file = name,
				segments = file.split('/');
		
			// If the module name does not have an extension, append the default one
			if (segments[segments.length - 1].lastIndexOf('.') == -1) {
				file += '.html';
			}
			
			textPlugin.get(req.toUrl(file), function(html) {
			
				console.group(name);
				console.log('Original:', html);
				
				if (config.config.html.comments === true) {
					html = this.stripComments(html);
				}
				
				if (config.config.html.whitespaceBetweenTags === true) {
					html = this.stripWhitespaceBetweenTags(html);
				}
				
				if (config.config.html.whitespaceBetweenTagsAndText === true) {
					html = this.stripWhitespaceBetweenTagsAndText(html);
				}
				
				if (config.config.html.whitespaceWithinTags === true) {
					html = this.stripWhitespaceWithinTags(html);
				}
				
				if (config.isBuild) {
					buildText[name] = textPlugin.jsEscape(html);
				}
				
				console.log('Final:', html);
				console.groupEnd();
				onLoad(html);
				
			}.bind(this), onLoad.error);
		},
		
		
		write: function (pluginName, moduleName, write) {
			if (buildText.hasOwnProperty(moduleName)) {
				var name = "'" + pluginName + "!" + moduleName  + "'",
					text = "function () {return '" + buildText[moduleName] + "';}";
			
				write("define(" + name + ", " + text + ");\n");
			}
		},
		
		
		stripComments: function(html) {
			return html.replace(/<!--(.|[\n\r])*?-->/gm, '');
		},
		
		
		stripWhitespaceBetweenTags: function(html) {
			return html.replace(/>[\n\r\s]+</gm, '><');
		},
		
		
		stripWhitespaceBetweenTagsAndText: function(html) {
			return html.replace(/>[\n\r\s]+/gm, '>').replace(/[\n\r\s]+</gm, '<');
		},
		
		
		stripWhitespaceWithinTags: function(html) {
			var tagPattern = /<([^>"']*?|"[^"]*?"|'[^']*?')+>/g,
				attrPattern = /([^\0\n\r\s"'>\/=]+)(?:\s*=\s*([^\n\r\s"'=><`]+|"[^"]*"|'[^']*'))?/gi,
				lastIndex = 0,
				result = '',
				match,
				tag;
			
			while ((match = tagPattern.exec(html)) !== null) {
				
				// Copy text between the beginning of this match and the end of the last one
				result += html.substring(lastIndex, match.index);
				tag = match[0];
				
				if (/^<[^\/]/.test(tag)) {  // It's a start tag
					var attrs = tag.match(attrPattern),
						start = attrs.shift(),
						end = /\/>$/.test(tag) ? '/>' : '>';
					
					result += start + attrs.map(function(attr) {
						return attr.replace(attrPattern, ' $1=$2');
					}).join('') + end;
				}
				
				else {  // It's an end tag
					result += tag.replace(/[\n\r\s]+/g, '');
				}
				
				lastIndex = tagPattern.lastIndex;
			}
			
			return result + html.substring(lastIndex);
		}
		
	};

});