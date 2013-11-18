define(['text'], function(textPlugin) {
	
	var buildText = {};
	
	return {
		
		load: function(name, req, onLoad, config) {
			var file = name;
		
			// If the module name does not have an extension, append the default one
			if (file.lastIndexOf('.') == -1) {
				file += '.html';
			}
			
			textPlugin.get(req.toUrl(file), function(html) {
			
				if (config.config.html.stripComments === true) {
					html = this.stripComments(html);
				}
				
				if (config.config.html.stripWhitespace === true) {
					html = this.stripWhitespaceBetweenTags(html);
				}
				
				if (config.isBuild) {
					buildText[name] = textPlugin.jsEscape(html);
				}
			
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
			return html.replace(/<!--[\n\r\s]*?-->/gm, '');
		},
		
		
		stripWhitespaceBetweenTags: function(html) {
			return html.replace(/>[\n\r\s]+</gm, '><');
		}
		
	};

});