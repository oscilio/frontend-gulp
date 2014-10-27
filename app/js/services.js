angular.module('app')
    .factory('Users', function ($resource, ENV) {
      return $resource(ENV.apiUrl + '/api/v1/users.json');
    })

    .factory('Sounds', function ($resource, ENV) {
      //return $resource(ENV.apiUrl + '/api/v1/sounds.json', {format: 'json'});
      return {
        queryTopSounds: function() {
          return [{
            id: '1',
            user: {
              username: 'dcunit3d'
            },
            title: 'New 808 Drumkit Config',
            post: 'Sick new #drumkit using the classic $Roland808, cant fake that sound #electrofunk',
            soundbyteUrl: '/sounds/crystalmethod.mp3',
            configFiles: true
          },
            {
              id: '2',
              user: {
                username: 'Edit'
              },
              title: 'Nu Glitch Sound',
              post: 'Just posted this $Massive #nuGlitch byte, check it out @kraddy',
              soundbyteUrl: '/sounds/artsyremix.mp3',
              configFiles: true
            },
            {
              id: '3',
              user: {
                username: 'kraddy'
              },
              title: '2014 Tour Byte',
              post: 'Check out our #NewSound from the @GlitchMob show in #NYC!',
              soundbyteUrl: '/sounds/androidporn.mp3',
              configFiles: false
            },
            {
              id: '4',
              user: {
                username: 'ooah'
              },
              title: 'New Bass Kick',
              //http://www.powerdrumkit.com/download.htm
              post: 'Sick new #Bass #Kick using the $MTPowerDrumKit2 #Free #VST',
              soundbyteUrl: '/sounds/hacksaw.mp3',
              configFiles: true
            },
            {
              id: '5',
              user: {
                username: 'djshadow'
              },
              title: 'New Gravediggin Mix Preview Byte',
              post: "Y'all won't believe the record I just dug up from the #graveyard #gravediggin $vinyl",
              soundbyteUrl: '/sounds/djshadow.mp3',
              configFiles: false
            },
            {
              id: '6',
              user: {
                username: 'egyptianlover'
              },
              title: "Guess who's back y'all?",
              post: "Check out a #NewByte of my upcoming album, #PlatinumPyramids.  And yes -- still 100% true to da $808!",
              soundbyteUrl: '/sounds/egyptegypt.mp3',
              configFiles: false
            },
            {
              id: '7',
              user: {
                username: 'urbansage'
              },
              title: "Words of Wisdom",
              post: "Give this #byte a listen, part of a new track I got a new track coming on Friday!",
              soundbyteUrl: '/sounds/imtechnique.mp3',
              configFiles: true
            }];
        }
      };
    });
