angular.module('sql-prototype')
    .directive('quote', function (){
        return {
            restrict: 'E',
            scope: {
                text: '@',
                character: '='
            },
            transclude: true,
            template: '\
            <div class="vertical-padding-30">\
                <p style="padding-bottom: 0; margin-bottom: 0">"<span ng-transclude></span>"</p>\
                <span style="padding-top: 0; margin-top: 0" class="horizontal-padding-30">- {{character.name}}, {{character.context}}</span>\
            </div>\
            '
        }
    });