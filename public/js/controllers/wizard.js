angular.module('sql-prototype')
    .controller('WizardCtrl', function ($scope){

        $scope.navStep = '';
        $scope.visitedSteps = [];

        $scope.changeToStep = function (step){
            if ($scope.visitedSteps.indexOf(step) === -1)
                $scope.visitedSteps.push(step);

            $scope.navStep = step;
        };

        $scope.changeToStep('step1');

        $scope.isVisitedStep = function (step){
            return (!$scope.isCurrentStep(step) && $scope.visitedSteps.indexOf(step) !== -1);
        };

        $scope.isCurrentStep = function (step){
            return $scope.navStep === step;
        };

    });
