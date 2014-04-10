angular.module('sql-prototype')
    .service('QuoteManager', QuoteManagerService);


function QuoteManagerService($http){

    this.findAllQuotes = function(){
        return $http.get('/api/quote/findAll', {context: 'all-quotes'});
    };

    this.findQuote = function(id){
        return $http.get('/api/quote/find?id=' + id);
    };

    this.addQuote = function (text, characterId){
        return $http.post('/api/quote/add', {text: text, character_id: characterId});
    };

    this.updateQuote = function (id, text, characterId, userId){
        return $http.post('/api/quote/update', {id: id, text: text, character_id: characterId, user_id: userId});
    };

    this.deleteQuote = function (id){
        return $http.delete('/api/quote/delete', {id: id});
    };

}
