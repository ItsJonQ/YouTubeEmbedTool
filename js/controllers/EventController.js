'use strict';

ytToolApp.controller('EventController', 
	function EventController($scope, $resource) {
		console.log('"EventsController" was initiated.');

		$scope.eventReset = function(){
			$scope.embedCode = '';
			$scope.embedCodeOutput = '';
			$scope.videoThumbnail = '';
			$scope.embedError = false;
			$scope.embedShow = false;
			$scope.embedWidth = 630;

			$scope.videoDetails = {'title': '', 'category': '', 'user': '', 'thumbnailFile': 'thumbnail'};
		};

		$scope.eventReset();

		$scope.eventError = function(){
			$scope.eventReset();
			$scope.embedError = true;
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

		$scope.validateYT = function(embedID){
			$scope.fetchYT = $resource('https://gdata.youtube.com/feeds/api/videos/:action', 
				{ action: embedID, v: 2, alt: 'json', callback: 'JSON_CALLBACK' },
				{ get:{ method: 'JSONP' }}
			);
			$scope.fetchYT.get(function(result) {
				var embedCodeHTML = '<iframe width="'+$scope.ytVideoAttr.videoWidth+'" height="'+$scope.ytVideoAttr.videoHeight+'" src="http://www.youtube.com/embed/'+$scope.ytVideoAttr.videoID+'" frameborder="0" allowfullscreen></iframe>';
				var videoThumbnailURL = 'http://img.youtube.com/vi/'+$scope.ytVideoAttr.videoID+'/maxresdefault.jpg';
				var data = result.entry;

				$scope.embedCodeOutput = embedCodeHTML;
				$scope.videoThumbnail = videoThumbnailURL;
				if(embedCodeHTML !== null ) {
					$scope.embedShow = true;
				} else {
					$scope.embedShow = false;
				}

				// Video Info
				$scope.videoDetails.title = data.title.$t;
				$scope.videoDetails.category = data.media$group.media$category[0].label;
				$scope.videoDetails.user = data.media$group.media$credit[0].$t;
				$scope.videoDetails.thumbnailFile = data.title.$t;

			}, function() {
				$scope.eventError();
			});
		};

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
						$scope.validateYT($scope.ytVideoAttr.videoID);
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