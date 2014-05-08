angular.module('todo').factory('demoDataLoader', function($http, demoDataUrl) {
	"use strict";

	return {
		retrieveDemoData : function() {
			return $http.get(demoDataUrl).then(function(response) {
				var data = response.data.result;
				var todo;
				var taskList = [];
				for (var i = 0; i < data.length; ++i) {
					todo = data[i];
					taskList.push({
						title : todo.title,
						isComplete : todo.iscomplete === 'true'
					});
				}
				return taskList;
			});
		}
	};

});