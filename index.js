var l = function(o) {console.log(o); return o;},
		require = require || undefined;
		
if(require) {
	module.exports = {
		parse: require("./parse.js"),
		compose: require("./compose.js"),
	};
}	
