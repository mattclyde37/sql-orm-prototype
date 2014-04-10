angular.module('sql-prototype')
    .controller('QuoteCtrl', function ($scope, $state, QuoteManager, CharacterManager) {

        $scope.characters = {
            keys: [],
            all: [],
            contexts: [],
            matchingCharacter: null
        };

        $scope.quotes = {
            all: []
        };

        $scope.quote = {
            text: '',
            name: '',
            context: ''
        };

        loadQuotes();
        loadCharacters();

        $scope.matchingCharacterFound = false;
        $scope.checkCharacter = function (name){
            name = name.toLowerCase();
            $scope.characters.matchingCharacter = null;
            $scope.matchingCharacterFound = false;
            $scope.characters.all.forEach(function (character){
                 if (character.name.toLowerCase() === name){
                     $scope.characters.matchingCharacter = character;
                     $scope.quote.context = character.context;
                     $scope.matchingCharacterFound = true;
                 }
            });
        };

        $scope.addQuote = function (quote){
            if ($scope.characters.matchingCharacter){
                QuoteManager.addQuote(quote.text, $scope.characters.matchingCharacter.id)
                    .success(function (quote){
                        $scope.quotes.all.push(quote);
                    });
                clearQuote();
            } else {
                CharacterManager.addCharacter($scope.quote.name, $scope.quote.context)
                    .success(function (character){
                        QuoteManager.addQuote(quote.text, character.id)
                            .success(function (q){
                                $scope.quotes.all.push(q);
                            });
                        $scope.characters.all.push(character);
                        prepareCharacters();
                        clearQuote();
                    });
            }

        };

        $scope.showCharacterModal = false;
        $scope.toggleFindCharacterModal = function (){
            $scope.showCharacterModal = !$scope.showCharacterModal;
        };

        $scope.characterSelected = function (character){
            $scope.matchingCharacterFound = true;
            $scope.characters.matchingCharacter = character;
            $scope.quote.name = character.name;
            $scope.quote.context = character.context;
            $scope.showCharacterModal = false;
        };

        $scope.getCharacterForQuote = function (quote){
            debugger;
            return $scope.characters.keys[quote.character_id];
        };



        function loadQuotes (){
            QuoteManager.findAllQuotes().success(function (quotes){
                $scope.quotes.all = quotes;
            });
        }

        function loadCharacters() {
            CharacterManager.findAllCharacters().success(function (characters){
                $scope.characters.all = characters;
                prepareCharacters();
            });
        }

        function prepareCharacters(){
            $scope.characters.keys = [];
            $scope.characters.contexts= [];
            $scope.characters.all.forEach(function (character){
                $scope.characters.keys[character.id] = character;

                if ($scope.characters.contexts.indexOf(character.context) === -1)
                    $scope.characters.contexts.push(character.context);
                if (!$scope.characters.contexts[character.context])
                    $scope.characters.contexts[character.context] = [];
                $scope.characters.contexts[character.context].push(character);

            });
        }


        function clearQuote(){
            $scope.quote.text = '';
            $scope.quote.name = '';
            $scope.quote.context = '';
            $scope.matchingCharacterFound = false;
            $scope.characters.matchingCharacter = null;
        }


    });
