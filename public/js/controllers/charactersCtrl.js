angular.module('sql-prototype')
    .controller('CharactersCtrl', function ($scope, $state, CharacterManager, QuoteManager){

        $scope.characters = [];
        loadCharacters();

        $scope.selectedCharacter = null;

        $scope.addCharacter = function(info){
            CharacterManager.addCharacter(info.name, info.context)
                .success(function (character){
                    loadCharacters();
                })
                .error(function (err){
                    alert('Error add character');
                });
            info.name = '';
            info.context = '';
        };

        $scope.selectCharacter = function (character){
            $scope.selectedCharacter = character;
        };


        // editing functions
        $scope.editing = false;
        $scope.editCharacter = function(character){
            $scope.editing = true;
        };

        $scope.doneEditingCharacter = function(character){
            $scope.editing = false;
            CharacterManager.updateCharacter(character.id, character.name, character.context)
                .success(loadCharacters);
        };

        $scope.deleteCharacter = function(character){
            CharacterManager.deleteCharacter(character.id).success(loadCharacters);
            $scope.selectedCharacter = null;
        };

        function loadCharacters(){
            CharacterManager.findAllCharacters()
                .success(function (characters){
                    $scope.characters = characters;
                    loadQuotes();
                })
        }

        function loadQuotes(){
            debugger;
            QuoteManager.findAllQuotes()
                .success(function (quotes){
                    var dictionary = quotes.reduce(function(prev, curr, index, arr){
                        if (!prev[curr.character_id])
                            prev[curr.character_id] = [];
                        prev[curr.character_id].push(curr);
                        return prev;
                    }, []);
                    $scope.characters.forEach(function (character){
                        if (dictionary[character.id])
                            character.quotes = dictionary[character.id];
                    });
                });
        }

    });