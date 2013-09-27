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
			
			$scope.embedCodeOutput = '<iframe width="'+$scope.ytVideoAttr.videoWidth+'" height="'+$scope.ytVideoAttr.videoHeight+'" src="http://www.youtube.com/embed/'+$scope.ytVideoAttr.videoID+'" frameborder="0" allowfullscreen></iframe>';
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
				$scope.embedError = false;
				$scope.embedShow = false;
				if(embed.indexOf("youtube.com") !=-1 ) {
					var embedArray, embedID, embedIDArray;
					embedArray = embed.split('/');
					embedIDArray = embedArray[3].split('=')[1];
					embedID = embedIDArray.split('#')[0];
					if(embedID) {
						var embedCodeHTML,
							videoThumbnailURL;
						$scope.ytVideoAttr.videoID = embedID;
						$scope.embedCode = embed;
						$scope.validateYT($scope.ytVideoAttr.videoID);
					} else {
						$scope.eventError();
					}
				} else {
					$scope.eventError();
				}
			} else {
				$scope.eventReset();
			}
		};
	}
);