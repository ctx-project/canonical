var l = function(o) {console.log(o); return o;},
		require = require || undefined;
		
if(require) {
	var CtxParser = require("./parser.js");
}	

var CtxParse = {
	text(text, derivatives) {
		return text.split('\n').map(i => CtxParse.item(i, derivatives)).filter(r => r);
	},
	
	item(item, derivatives) {
		if(!item.trim()) return null;
		
		var tokens = CtxParser.parse(item),
				length = tokens.length,
				verb = length ? getVerb(tokens[0]) : null,
				id = length ? getId(tokens[length - 1]) : null,
				record = {item, verb, id, tokens, removed: id && length == 1};

		if(id) tokens.pop();
		if(verb) tokens.shift();
		
		if(derivatives)
			derivatives.forEach(d => CtxParse[d](record));

		return record;
		
		function getVerb(token) {
			return ['!', '!!', '?', '??', '$', '$$'].indexOf(token.body) != -1 ? token.body : null;
		}
		
		function getId(token) {
			var match = token.body.match(/^~(\d{3,})$/);
			return match ? match[1] : null;
		}
	},
	
	tags(record) {
		record.tags = record.tokens.filter(t => t.type == 'tag');
	},
	case(record) {
		record.tags = record.tags.map(t => {t.body = t.body.toLowerCase(); return t;});
	},
	sign(record) {
		record.positiveTags = record.tags.filter(t => t.sign != '-');
		record.negativeTags = record.tags.filter(t => t.sign == '-');
	},
	signature(record) {
		var sig = [];
		
		record.tags.forEach(t => {
			if(t.parts.length == 1)
				sig.push(t.name.toLowerCase());
			else	
				sig = sig.concat(t.parts.filter(p => isNaN(+p)).map(p => p.toLowerCase()));
		});
		
		//? maybe in parser
		if(record.tokens.find(t => t.body == '|')) sig.push('|');
		
		record.signature = sig;
	},
	meta(record) {
		var meta = {};
		
		record.tags.forEach(t => {
			if(t.name[0] == '*') meta[t.name.toLowerCase()] = t.value || true;
		});
		
		record.meta = meta;
	},
	
	head(record) {
		var ix = record.tokens.findIndex(t => t.type == 'word');
		record.head = ix == -1 ? record.tokens : record.tokens.slice(0, ix);
	},
	split(record) {
		var head = record.head,
				length = head.length;
		record.split = length ? head[length - 1].end : 0;
		//?dc exista verb ?
	},
	
	query(record) {
		record.query = record.tokens.filter(t => t.body[0] != '*').map(t => t.body).join(' ');
	},
	
}

if(require) {
	module.exports = CtxParse;
}	
