var l = function(o) {console.log(o); return o;},
		require = require || undefined;
		
if(require) {
	var CtxParser = require("./parser.js");
}	

var CtxParse = {
	text(text, derivatives) {
		return text.split('\n').map(i => CtxParse.item(i, derivatives));
	},
	
	item(item, derivatives) {
		var tokens = CtxParser.parse(item),
				length = tokens.length,
				verb = getVerb(tokens[0]),
				id = getId(tokens[length - 1]),
				parsed = {item, verb, id, tokens};

		if(id) tokens.pop();
		if(verb) tokens.shift();
		
		if(derivatives)
			derivatives.forEach(d => CtxParse[d](parsed));

		return parsed;
		
		function getVerb(token) {
			return ['!', '!!', '?', '??', '$', '$$'].indexOf(token.body) != -1 ? token.body : null;
		}
		
		function getId(token) {
			return token.body.match(/^~\d{3,}$/) ? token.body : null;
		}
	},
	
	tags(parsed) {
		parsed.tags = parsed.tokens.filter(t => t.type == 'tag');
	},
	signature(parsed) {
		var sig = [];
		
		parsed.tags.forEach(t => {
			sig.push(t.name.toLowerCase());
			if(t.parts.length > 1)
				sig = sig.concat(t.parts.filter(p => isNaN(+p)).map(p => p.toLowerCase()));
		});
		
		parsed.signature = sig;
	},
	meta(parsed) {
		var meta = {};
		
		parsed.tags.forEach(t => {
			if(t.name[0] == '*') meta[t.name.toLowerCase()] = t.value || true;
		});
		
		parsed.meta = meta;
	},
	
	head(parsed) {
		var ix = parsed.tokens.findIndex(t => t.type == 'word');
		parsed.head = ix == -1 ? parsed.tokens : parsed.tokens.slice(0, ix);
	},
	split(parsed) {
		var head = parsed.head,
				length = head.length;
		parsed.split = length ? head[length - 1].end : 0;
		//?dc exista verb ?
	},
	
	query(parsed) {
		parsed.query = parsed.tokens.filter(t => t.body[0] != '*').map(t => t.body).join(' ');
	},
	
}

if(require) {
	module.exports = CtxParse;
}	
