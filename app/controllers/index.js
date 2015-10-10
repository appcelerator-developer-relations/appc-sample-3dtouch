var cameraActive = false;

Ti.App.iOS.addEventListener("shortcutitemclick", takePicture);

function takePicture() {
	if (cameraActive) {
		return;
	}

	if (Ti.Media.isCameraSupported === false) {
		refreshUI(Ti.UI.createView({
			width : 500,
			height : 500,
			backgroundColor : "red"
		}).toImage());

		return;
	}

	cameraActive = true;

	Ti.Media.showCamera({
		allowEditing : true,
		success : function(e) {
			cameraActive = false;
			setTimeout(function() {
				refreshUI(e.media);
			}, 500);
		},
		cancel : function() {
			cameraActive = false;
		},
		error : function() {
			cameraActive = false;
		},
	});
}

function refreshUI(image) {
	var imageView = Ti.UI.createImageView({
		image : image,
		backgroundColor : "red",
		width : Alloy.Globals.imageWidth,
		height : Alloy.Globals.imageHeight,
		top : 0,
		left : 0,
		userInfo : {
			title : "My Great Image",
			source : image
		}
	});

	if (Ti.UI.iOS.forceTouchSupported) {
		var previewContext = Ti.UI.iOS.createPreviewContext({
			preview : createPreview(imageView.userInfo),
			actions : createPreviewActions(imageView),
			contentHeight : 400,
			pop : function() {
				var details = Alloy.createController("details", imageView.userInfo);
				$.nav.openWindow(details.getView());
			}
		});

		imageView.setPreviewContext(previewContext);
	}

	$.scrollView.add(imageView);
	$.placeholder.setVisible(false);
}

function createPreview(userInfo) {
	return Alloy.createController("preview", userInfo).getView();
}

function createPreviewActions(sourceView) {

	var sendAction = Ti.UI.iOS.createPreviewAction({
		title : "Send per Mail",
		style : Ti.UI.iOS.PREVIEW_ACTION_STYLE_DEFAULT
	});

	sendAction.addEventListener("click", function() {
		openEmailDialog(sourceView.image);
	});

	var confirmAction = Ti.UI.iOS.createPreviewAction({
		title : "Confirm",
		style : Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE
	});

	var cancelAction = Ti.UI.iOS.createPreviewAction({
		title : "Cancel"
	});

	var deleteAction = Ti.UI.iOS.createPreviewActionGroup({
		title : "Delete",
		actions : [confirmAction, cancelAction],
		style : Ti.UI.iOS.PREVIEW_ACTION_STYLE_DESTRUCTIVE
	});

	confirmAction.addEventListener("click", function() {
		deleteImage(sourceView);
	});

	return [sendAction, deleteAction];
}

function openEmailDialog(image) {
	var dialog = Ti.UI.createEmailDialog({
		subject : "My great picture!"
	});
	dialog.addAttachment(image);
	dialog.open();
}

function deleteImage(image) {
	image.animate({
		duration : 500,
		opacity: 0,
	}, function() {
		$.scrollView.remove(image);
		
		if($.scrollView.children.length == 0) {
			$.placeholder.setVisible(true);
		}
	});
}

$.nav.open();
