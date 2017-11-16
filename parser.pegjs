item	=	tokens:token* _? {return tokens;}

token	=	_? token:(tag / word) {return token}

tag		= sign:[-+]? name:$((([A-Z] part) / ('*' part) / ('#' part)) ('.' part)*) value:(':' value)? 
			{
					if(name[0] == '#') name = name.slice(1);
					var loc = location(), parts = name.split('.');
					return {type: 'tag', body: text(), start: loc.start.offset, end: loc.end.offset,
									sign, name, parts, value: value ? value[1] : null }
			}

part	= $ [a-z0-9]i+

value	= $ [^ \t\n\r]+

word	= word:[^ \t\n\r]+ 
			{
					var loc = location();
					return {type: 'word', body: text(), start: loc.start.offset, end: loc.end.offset }
			}

_		= $ [ \t\n\r]+
	 