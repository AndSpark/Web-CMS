
function replaceAsync(str, re, callback) {
	// http://es5.github.io/#x15.5.4.11
	str = String(str);
	var parts = [],
			i = 0;
	if (Object.prototype.toString.call(re) == "[object RegExp]") {
			if (re.global)
					re.lastIndex = i;
			var m;
			while (m = re.exec(str)) {
					var args = m.concat([m.index, m.input]);
					parts.push(str.slice(i, m.index), callback.apply(null, args));
					i = re.lastIndex;
					if (!re.global)
							break; // for non-global regexes only take the first match
					if (m[0].length == 0)
							re.lastIndex++;
			}
	} else {
			re = String(re);
			i = str.indexOf(re);
			parts.push(str.slice(0, i), callback.apply(null, [re, i, str]));
			i += re.length;
	}
	parts.push(str.slice(i));
	return Promise.all(parts).then(function(strings) {
			return strings.join("");
	});
}


function htmlEncode(str) {
	var s = ''
	if (str.length == 0) return ''
	s = str.replace(/&/g, '&amp;')
	s = s.replace(/</g, '&lt;')
	s = s.replace(/>/g, '&gt;')
	// s = s.replace(/ /g, '&nbsp;')
	s = s.replace(/\'/g, '&#39;')
	s = s.replace(/\"/g, '&quot;')
	return s
}

function htmlDecode(str) {
	var s = ''
	if (!str || str.length == 0) return ''
	s = str.replace(/&amp;/g, '&')
	s = s.replace(/&lt;/g, '<')
	s = s.replace(/&gt;/g, '>')
	s = s.replace(/&nbsp;/g, ' ')
	s = s.replace(/&#39;/g, "'")
	s = s.replace(/&quot;/g, '"')
	return s
}

export {replaceAsync,htmlEncode,htmlDecode}