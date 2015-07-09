/**
 * Created by panew on 15-7-8.
 */
var Promise = require('bluebird');
var request = require("request");
var cheerio = require('cheerio');
var querystring = require('querystring');


var BASEURL = 'http://lolbox.duowan.com/playerDetail.php?';

$('#search').on('click', function () {
  var serverName = $("#area").val();
  var playerNames = $('#nick').val().split(/\n|\r|\r\n/);

  Promise.map(playerNames, function (playerName) {
    var obj = {
      serverName: serverName,
      playerName: playerName.indexOf('加入房间') !== -1 ? playerName.substring(0, playerName.length - 5) : playerName
    };
    request(BASEURL + querystring.stringify(obj), function (err, response, body) {
      var $$ = cheerio.load(body, {
        normalizeWhitespace: true,
        xmlMode            : true
      });
      var recent = $$.html('.recent table');
      recent = recent ? recent : '暂无数据';

      var playerName = '<h5 class="player-name">' + obj.playerName + '</h5>';
      $('#data').append('<div class="recent-info">' + playerName + recent + '</div>');
    })
  }).then(function(result){

    $('#data').append(result);
  });
});

$('#clear').on('click', function () {
  $('#data').html('')
});

$('select').material_select();