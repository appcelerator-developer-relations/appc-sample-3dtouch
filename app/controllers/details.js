var userInfo = arguments[0] || {};

function refreshUI() {
	$.window.setTitle(userInfo.title);
	$.imageView.setImage(userInfo.source);
}
