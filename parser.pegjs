item	=	tokens:token* _? {return tokens;}

token	=	_? token:(date / coordinates / number / ctag / vtag / stag / idref / word) {return token;}

ctag		= sign:[-+]? name:$('.'? part ('.' part)+) value:(':' value)? 
			{
					if(name[0] == '.') name = name.slice(1);
					var loc = location(), parts = name.split('.');
					if(parts.length > 1) parts.unshift(name);
					return {type: 'tag', body: text(), start: loc.start.offset, end: loc.end.offset,
							sign, name, parts, value: value ? value[1] : null };
			}

vtag	= sign:[-+]? '.'? name:part ':' value:value
			{
							var loc = location();
				return {type: 'tag', body: text(), start: loc.start.offset, end: loc.end.offset,
						sign, name, parts: [name], value };
			}

stag	= sign:[-+]? [.#] name:part
			{
							var loc = location();
								return {type: 'tag', body: text(), start: loc.start.offset, end: loc.end.offset,
										sign, name, parts: [name] };
			}

part	= $ [a-z0-9]i+

value	= date / coordinates / number / idref / tagref

idref	= '~' value:$([0-9][0-9][0-9]+) {
				var loc = location();
				return {type: 'id', body: text(), start: loc.start.offset, end: loc.end.offset, 
										value };
			}
tagref	= $ part ('.' part)* {
				var parts = text().split('.');
				if(parts.length > 1) parts.unshift(text());
				return {type: 'tag', value: text(), parts };
			}
coordinates	= [+-]?[0-9][0-9]?'.'[0-9][0-9][0-9]+(', ' / ',' / ' ')[+-]?[0-9][0-9]?[0-9]?'.'?[0-9][0-9][0-9]+ {
				var loc = location();
								return {type: 'coordinates', body: text(), start: loc.start.offset, end: loc.end.offset, 
										value: text() };
			}
number	= sign:[+-]? [0-9]+ ('.' [0-9]+)? {
				var loc = location();
				return {type: 'number', body: text(), start: loc.start.offset, end: loc.end.offset, 
										value: +text() };
			}
date	= day:$([0-9][0-9]?) & { return +day > 0 && +day < 32;} [ .-/] 
			month:$(month:$([0-9][0-9]?) & { return +month > 0 && +month < 13;} 
					/ ('jan'i 'uary'i?) / ('feb'i 'ruary'i?) / ('mar'i 'ch'i?) / ('apr'i 'il'i?) 
					/ ('may'i) / ('jun'i 'ne'i?) / ('jul'i 'y'i?) / ('aug'i 'ust'i?) 
					/ ('sep'i 'tember'i?) / ('oct'i 'ober'i?) / ('nov'i 'ember'i?) / ('dec'i 'ember'i?) 
					) [ .-/] 
					year:$([0-9][0-9] ([0-9][0-9])?) {
								var m = +month;
								if(isNaN(m)) m = ['', 'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'].indexOf(month.slice(0,3).toLowerCase());
								var loc = location();
				return {type: 'date', body: text(), start: loc.start.offset, end: loc.end.offset, 
										value: new Date(year, m - 1, day) };
			}

word	= sign:[-+]? word:[^ \t\n\r]+ 
			{
					var loc = location();
					return {type: 'word', body: text(), start: loc.start.offset, end: loc.end.offset, 
												sign};
			}

_		= $ [ \t\n\r]+
	 