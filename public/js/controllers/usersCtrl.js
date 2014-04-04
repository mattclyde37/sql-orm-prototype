angular.module('sql-prototype')
    .controller('UsersCtrl', function ($scope, UserManager){

        $scope.users = [];
        $scope.selectedUser = null;
        loadUsers();


        $scope.newUserInfo = {
            name: '',
            pass: '',
            isAdmin: false
        };

        // Creates a new user
        $scope.createUser = function(info){
            UserManager.addUser(info.name, info.pass, info.isAdmin, function (user){
               loadUsers();
            });
            info.name = '';
            info.pass = '';
            info.isAdmin = false;
        };


        // Deletes a user
        $scope.deleteUser = function (user){
            UserManager.removeUser(user.username, function (result){
                if (result.success){
                    $scope.selectedUser = null;
                    loadUsers();
                } else {
                    alert('Could not delete user');
                }
            });
        };


        // Shows the details of the selected user
        $scope.userClicked = function (user){
            if ($scope.editing)
                $scope.doneEditingUser();

            $scope.selectedUser = user;
        };


        // Edit User Functions
        $scope.editing = false;

        $scope.editUser = function (user){
            $scope.editing = true;
        };

        $scope.doneEditingUser = function (user){
            $scope.editing = false;
            UserManager.updateUser(user.id, user.username, function (affectedUsers){
                if (affectedUsers)
                    loadUsers();
            })
        };

        $scope.saveUsersRole = function (user){
            debugger;
            UserManager.updateUsersRole(user.id, user.isAdmin, function (affectedUsers){
                debugger;
               if (affectedUsers)
                   loadUsers();
            });
        };


        // Gets all the current users
        function loadUsers(){
            UserManager.getAllUsers(function (users){
               $scope.users = users;
            });
        }
    });