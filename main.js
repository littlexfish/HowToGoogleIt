let redirect=false;
let str="";
let len=0;
let frame=0;
function locale(localeString){if(localeString==='zh_tw') return;}
function onSearch(){
	if(redirect)return;
	let search=document.getElementById('search').value;
	let url=window.location.href;
	if(url.includes('?'))url+='&';else url+='?';
	document.getElementById('qOutput').value=url+'q='+search;
	document.querySelector('.qBox.qHide').classList.remove('qHide');
}
function moveToBoxEnd() {
	let cursor=document.querySelector('.cursor');
	cursor.removeEventListener('animationend', moveToBoxEnd);
	cursor.addEventListener('animationend', cursorClickEnd);
	cursor.classList.remove('cursorMoveBox')
	cursor.classList.add('cursorMoveBoxEnd')
}
function cursorClickEnd() {
	let cursor=document.querySelector('.cursor');
	cursor.removeEventListener('animationend', cursorClickEnd);
	window.requestAnimationFrame(onTypeAnim);
}
function moveToSearchEnd() {
	document.querySelector('.cursor').removeEventListener('animationend', moveToSearchEnd);
	let cursor=document.querySelector('.cursor');
	cursor.addEventListener('animationend', onRedirect);
	cursor.classList.remove('cursorMoveBoxEnd')
	cursor.classList.remove('cursorMoveSearch')
	cursor.classList.add('cursorMoveSearchEnd')

}
function onRedirect() {
	window.location.href = 'https://www.google.com/search?q=' + str;
}
function onTypeAnim() {
	if(frame<5) {
		frame++;
		window.requestAnimationFrame(onTypeAnim);
		return;
	}
	frame=0;
	document.getElementById('search').value=str.substring(0, len++);
	if(len<=str.length) window.requestAnimationFrame(onTypeAnim);
	else {
		let img=document.querySelector('.cursor')
		img.addEventListener('animationend', moveToSearchEnd);
		img.classList.add('cursorMoveSearch');
	}
}
(function(){
	let query=new URLSearchParams(window.location.search);
	locale(query.get('l'));
	redirect=query.has('q');
	let button=document.getElementById('bt');
	if(!redirect){
		return;
	}
	str=query.get('q');
	document.getElementById('search').readOnly=true;
	let img = document.querySelector('.cursor');
	img.addEventListener('animationend', moveToBoxEnd);

	img.classList.remove('qHide');
	img.classList.add('cursorMoveBox');

}())