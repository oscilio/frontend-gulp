angular.module('app')
    .directive("showsMessageWhenHovered", function () {
      return {
        link: function (scope, element, attributes) {
          var originalMessage = scope.message;
          element.bind("mouseenter", function () {
            scope.message = attributes.message;
            scope.$apply();
          });
          element.bind("mouseleave", function () {
            scope.message = originalMessage;
            scope.$apply();
          });
        }
      };
    })

    .directive('signupLoginWidget', function () {
      return {
        templateUrl: 'directives/signup-login-widget.html'
      };
    })

    .directive('userProfileWidget', function () {
      return {
        templateUrl: 'directives/user-profile-widget.html'
      };
    })

    .directive('navbarWidget', function () {
      return {
        controller: 'NavbarCtrl',
        templateUrl: 'directives/navbar-widget.html'
      };
    })
    
    .directive('exploreSoundWidget', function () {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/explore-sound.html',
        scope: {
          sound: '='
        }
      };
    })

    .directive('userListing', function() {
      return {
        restrict: 'E',
        replace: true,
        templateUrl: 'directives/user-listing.html',
        scope: {
          user: '='
        },
        link: function (scope, el, attr) {
          scope.isAdmin = scope.user.isAdmin();
        }
      }
    })

    .directive('userProfilePic', function () {
      return {
        templateUrl: 'directives/user-profile-pic.html',
        scope: {
          image: '=',
          email: '='
        }
      };
    });