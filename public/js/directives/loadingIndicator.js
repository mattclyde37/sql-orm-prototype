angular.module('sql-prototype')
    .directive("loadingIndicator", function() {
        return {
            restrict : "A",
            template: "<div>Loading...</div>",
            link : function(scope, element, attrs) {
                var context = attrs.context || '';
                scope.$on("loading-started-" + context, function(e) {
                    element.css({"display" : ""});
                });

                scope.$on("loading-complete-" + context, function(e) {
                    element.css({"display" : "none"});
                });

            }
        };
});