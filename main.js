/**
 * Check need redirect.
 */
let redirect=false;
/**
 * The string which need search.
 */
let str="";
/**
 * The string length use to animation of type words.
 */
let len=0;
/**
 * The number use to make animation of type words delay.
 */
let frame=0;
/**
 * Use to locallize some words.
 */
function locale() {
	document.getElementById('search').placeholder = getTranslate('searchBoxHint');
	document.getElementById('bt').innerHTML = getTranslate('searchButton');
	document.getElementById('copy').innerHTML = getTranslate('copy');
}
/**
 * Call on click search button.
 */
function onSearch() {
	if(redirect) return;
	let search = document.getElementById('search').value;
	let url = window.location.href;
	if(url.includes('?')) url += '&';
	else url += '?';
	document.getElementById('qOutput').value = url + 'q=' + base64.encode(search);
	document.querySelector('.qBox.qHide').classList.remove('qHide');
}
/**
 * Call when cursor move to search box.
 * The function will call from css animation end.
 */
function moveToBoxEnd() {
	let cursor = document.querySelector('.cursor');
	cursor.removeEventListener('animationend', moveToBoxEnd);
	cursor.addEventListener('animationend', cursorClickEnd);
	cursor.classList.remove('cursorMoveBox');
	cursor.classList.add('cursorMoveBoxEnd');
}
/**
 * Call when cursor click on search box.
 * The function will call from css animation end.
 */
function cursorClickEnd() {
	let cursor = document.querySelector('.cursor');
	cursor.removeEventListener('animationend', cursorClickEnd);
	window.requestAnimationFrame(onTypeAnim);
}
/**
 * Call when cursor move to search button.
 * The function will call from css animation end.
 */
function moveToSearchEnd() {
	document.querySelector('.cursor').removeEventListener('animationend', moveToSearchEnd);
	let cursor = document.querySelector('.cursor');
	cursor.addEventListener('animationend', onRedirect);
	cursor.classList.remove('cursorMoveBoxEnd');
	cursor.classList.remove('cursorMoveSearch');
	cursor.classList.add('cursorMoveSearchEnd');

}
/**
 * Call when cursor click on search button.
 * The function will call from css animation end.
 */
function onRedirect() {
	let query = new URLSearchParams(window.location.search);
	if(query.get('redirect') === 'false') return; // a choice to avoid redirect
	window.location.href = 'https://www.google.com/search?q=' + str.replaceAll(' ', '+'); // redirect to google search
}
/**
 * Use to animate type words
 */
function onTypeAnim() {
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
/**
 * Call on click copy button
 */
function onCopy() {
	let out = document.getElementById('qOutput');
	out.focus();
	out.select();
	let sc = document.execCommand('copy');
	if(sc) document.getElementById('copy').innerHTML = getTranslate('copySuccess');
	else navigator.clipboard.writeText(out.value)
		.then(() => document.getElementById('copy').innerHTML = getTranslate('copySuccess'),
				r => console.error('copy error: ' + r));
}
/**
 * Get translate string using id
 */
function getTranslate(id) {
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
(function() {
	let query = new URLSearchParams(window.location.search);
	locale();
	redirect = query.has('q');
	if(!redirect) {
		return;
	}
	str = base64.decode(query.get('q'));
	document.getElementById('search').readOnly = true;
	let img = document.querySelector('.cursor');
	img.addEventListener('animationend', moveToBoxEnd);

	img.classList.remove('qHide');
	img.classList.add('cursorMoveBox');
}())