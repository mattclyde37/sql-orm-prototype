angular.module('sql-prototype')
    .service('CharacterManager', CharacterManagerService);


function CharacterManagerService($http){

    this.findAllCharacters = function(){
        return $http.get('/api/characters', {context: 'all-characters'});
    };

    this.findCharacter = function(id){
        return $http.get('/api/characters/' + id);
    };

    this.addCharacter = function (name, context){
        return $http.post('/api/characters', {name: name, context: context});
    };

    this.updateCharacter = function (id, name, context){
        return $http.put('/api/characters/' + id, {name: name, context: context});
    };

    this.deleteCharacter = function (id){
        return $http.delete('/api/characters/' + id);
    };

    this.getCharactersQuotes = function (id){
        return $http.get('/api/character/quotes?id=' + id);
    }

}

