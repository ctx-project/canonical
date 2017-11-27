var l = l || function(o) {console.log(o); return o;};
		
var CtxCompose = {
	_forms: {
		plainTags: record => record.tokens.map(t => t.body).join(' '),
		markedTags: (record, format) => record.tokens.map(t => t.type == 'tag' ? `${format.tag[0]}${t.body}${format.tag[1]}` : t.body).join(' '),
		plainId: record => `~${record.id}`,
		markedId: (record, format) => `${format.id[0]}~${record.id}${format.id[1]}`
	},
	
	getItemSerializer(format) {
		format = format || {};
		var forms = [];
		
		if(format.tag) forms.push(this._forms.markedTags);
		else if(format.tag !== false) forms.push(this._forms.plainTags);
		
		if(format.id) forms.push(this._forms.markedId);
		else if(format.id !== false) forms.push(this._forms.plainId);
		
		return record => forms.map(f => f(record, format)).join(' ');
	},
	
	getTextSerializer(format, separator) {
		var serializeItem = this.getItemSerializer(format);
		return records => records.map(r => serializeItem(r)).join(separator);
	},

	removeFromHead(record, casedTags) {
		var split = record.tokens.findIndex(t => t.type != 'tag');
		
		record.tokens = record.tokens.filter((t, ix) => ix >= split || casedTags.indexOf(t.body.toLowerCase()) == -1);
		
		return record;
	},
}

if(require) {
	module.exports = CtxCompose;
}	
