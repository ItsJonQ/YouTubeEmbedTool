'use strict';

ytToolApp.controller('EventController', 
	function EventController($scope) {
		console.log('"EventsController" was initiated.');

		$scope.eventReset = function(){
			$scope.embedCode = '';
			$scope.embedCodeOutput = '';
			$scope.videoThumbnail = '';
			$scope.embedError = false;
			$scope.embedShow = false;
			$scope.embedWidth = 630;	
		};

		$scope.eventReset();

		$scope.eventError = function(){
			console.log('Embed Error');
			$scope.eventReset();
			$scope.embedError = true;
		};

		$scope.eventDestroy = function() {
			console.log('Embed Destroy');
			$scope.embedShow = false;
			$scope.embedCode = '';
			$scope.videoThumbnail = '';
		};

		$scope.embedSizeMathHD = function(width) {
			var height = Math.round((9 / 16) * width);
			return height;
		}

		$scope.embedWidthUpdate = function(width) {
			if(width !== null) {
				$scope.ytVideoAttr.videoWidth = width;
			} else {
				$scope.ytVideoAttr.videoWidth = 0;			
			}
			$scope.ytVideoAttr.videoHeight = $scope.embedSizeMathHD($scope.ytVideoAttr.videoWidth);
			$scope.inputUpdate($scope.embedCode);
			console.log($scope.embedCode);
		}

		$scope.ytVideoAttr = {
			videoWidth: $scope.embedWidth,
			videoHeight: $scope.embedSizeMathHD($scope.embedWidth),
			videoID: ''
		}	

		$scope.inputUpdate = function(embed) {
			if(embed !== '') {
				if(embed !== null) {
					var embedArray, embedID;
					embedArray = embed.split('/');
					if(embedArray[3]) {
						var embedCodeHTML,
							videoThumbnailURL;
						$scope.ytVideoAttr.videoID = embedArray[3].split('=')[1];
						$scope.embedCode = embed;
						embedCodeHTML = '<iframe width="'+$scope.ytVideoAttr.videoWidth+'" height="'+$scope.ytVideoAttr.videoHeight+'" src="http://www.youtube.com/embed/'+$scope.ytVideoAttr.videoID+'" frameborder="0" allowfullscreen></iframe>';
						videoThumbnailURL = 'http://img.youtube.com/vi/'+$scope.ytVideoAttr.videoID+'/maxresdefault.jpg'
						$scope.embedCodeOutput = embedCodeHTML;
						$scope.videoThumbnail = videoThumbnailURL;
						if(embedCodeHTML !== null ) {
							$scope.embedShow = true;
						} else {
							$scope.embedShow = false;
						}
					} else {
						$scope.eventError();
					}
				} 
			} else {
				$scope.eventReset();
			}
		};
	}
);