let redirect=false;
let str="";
let len=0;
let frame=0;
function locale() { // localize string
	document.getElementById('search').placeholder = getTranslate('searchBoxHint');
	document.getElementById('bt').innerHTML = getTranslate('searchButton');
	document.getElementById('copy').innerHTML = getTranslate('copy');
}
function onSearch() { // on click search button
	if(redirect) return;
	let search = document.getElementById('search').value;
	let url = window.location.href;
	if(url.includes('?')) url += '&';
	else url += '?';
	document.getElementById('qOutput').value = url + 'q=' + search;
	document.querySelector('.qBox.qHide').classList.remove('qHide');
}
function moveToBoxEnd() { // on cursor move to search box
	let cursor = document.querySelector('.cursor');
	cursor.removeEventListener('animationend', moveToBoxEnd);
	cursor.addEventListener('animationend', cursorClickEnd);
	cursor.classList.remove('cursorMoveBox');
	cursor.classList.add('cursorMoveBoxEnd');
}
function cursorClickEnd() { // on cursor click end
	let cursor = document.querySelector('.cursor');
	cursor.removeEventListener('animationend', cursorClickEnd);
	window.requestAnimationFrame(onTypeAnim);
}
function moveToSearchEnd() { // on cursor move to search button end
	document.querySelector('.cursor').removeEventListener('animationend', moveToSearchEnd);
	let cursor = document.querySelector('.cursor');
	cursor.addEventListener('animationend', onRedirect);
	cursor.classList.remove('cursorMoveBoxEnd');
	cursor.classList.remove('cursorMoveSearch');
	cursor.classList.add('cursorMoveSearchEnd');

}
function onRedirect() { // on cursor click and need to redirect
	let query = new URLSearchParams(window.location.search);
	if(query.get('redirect') === 'false') return; // a choice to avoid redirect
	window.location.href = 'https://www.google.com/search?q=' + str; // redirect to google search
}
function onTypeAnim() { // on type search query
	if(frame<20 / str.length) { // use to control type speed
		frame++;
		window.requestAnimationFrame(onTypeAnim);
		return;
	}
	frame=0;
	document.getElementById('search').value = str.substring(0, len++);
	if(len <= str.length) window.requestAnimationFrame(onTypeAnim);
	else { // on type end
		let img = document.querySelector('.cursor');
		img.addEventListener('animationend', moveToSearchEnd);
		img.classList.add('cursorMoveSearch');
	}
}
function onCopy() { // on click copy button
	let out = document.getElementById('qOutput');
	out.focus();
	out.select();
	let sc = document.execCommand('copy');
	if(sc) document.getElementById('copy').innerHTML = getTranslate('copySuccess');
	else navigator.clipboard.writeText(out.value)
		.then(() => document.getElementById('copy').innerHTML = getTranslate('copySuccess'),
				r => console.error('copy error: ' + r));
}
function getTranslate(id) { // get translate string
	let query = new URLSearchParams(window.location.search);
	let l = query.get('l')
	switch (id) {
		case 'searchBoxHint':
			switch (l) {
				case 'zh_tw':
					return '搜尋';
				default:
					return 'Search';
			}
		case 'searchButton':
			switch (l) {
				case 'zh_tw':
					return 'Google 搜尋';
				default:
					return 'Google Search';
			}
		case 'copy':
			switch (l) {
				case 'zh_tw':
					return '複製';
				default:
					return 'Copy';
			}
		case 'copySuccess':
			switch (l) {
				case 'zh_tw':
					return '複製成功';
				default:
					return 'Copy Success';
			}
	}
	console.error('error to get locale string');
	return 'error';
}
(function() { // main function
	let query = new URLSearchParams(window.location.search);
	locale();
	redirect = query.has('q');
	if(!redirect) {
		return;
	}
	str = query.get('q');
	document.getElementById('search').readOnly = true;
	let img = document.querySelector('.cursor');
	img.addEventListener('animationend', moveToBoxEnd);

	img.classList.remove('qHide');
	img.classList.add('cursorMoveBox');
}())
