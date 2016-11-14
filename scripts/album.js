

var createSongRow = function(songNumber, songName, songLength) {
    var template = 
      '<tr class="album-view-song-item">'
    + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' // review why/how data-song-number works
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + songLength + '</td>'
    + '</tr>'
    ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        
        // Set songItem to a Pause button and set currentlyPlayingSong to the songNumber
        // Switch from Pause to Play button to pause currently playing song 
        // Switch from Play to Pause button to indicate new song is playing
        
        var songItem = $(this).find('.song-item-number');
        var songNumber = songItem.attr("data-song-number");
    
        if (currentlyPlayingSongNumber === null) {
            songItem.html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
        } else if (currentlyPlayingSongNumber === songNumber) {
            songItem.html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentlyPlayingSongNumber = null; 
            currentSongFromAlbum = null;
        } else if (currentlyPlayingSongNumber !== songNumber) {
            songItem.html(pauseButtonTemplate);
            currentlyPlayingSongNumber = songNumber;
            currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
            updatePlayerBarSong();
        }
    };
    
    var onHover = function(event) {
        // $(this) refers to a $row 
        var songItem = $(this).find('.song-item-number');
        var songNumber = songItem.attr("data-song-number"); 
        // alt: var songNumber = songItem.data("song-number");
            if (songNumber != currentlyPlayingSongNumber) {
                songItem.html(playButtonTemplate)
                };
    };
    
    var offHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songNumber = songItem.attr("data-song-number"); 

        if (songNumber == currentlyPlayingSongNumber) {
            songItem.html(pauseButtonTemplate)
        } else (songNumber != currentlyPlayingSongNumber) {
            songItem.html(songNumber)
        }
    };
    
    $row.find('.song-item-number').click(clickHandler);
    $row.hover(onHover, offHover);
    return $row;
};

var setCurrentAlbum = function(album) {
    currentAlbum = album;
    
    var $albumTitle = $('.album-view-title');
    var $albumArtist = $('.album-view-artist');
    var $albumReleaseInfo = $('.album-view-release-info');
    var $albumImage = $('.album-cover-art');
    var $albumSongList = $('.album-view-song-list');
    
    $albumTitle.text(album.title);
    $albumArtist.text(album.artist);
    $albumReleaseInfo.text(album.year + ' ' + album.label);
    $albumImage.attr('src', album.albumArtUrl);
    $albumSongList.empty();

    for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
};

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  // update text of h2 tags that contain song name and artist name
    // reference current song variables to populate
    // jQuery selectors by class, then update by html, value = current song variables
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentSongFromAlbum.artist);
    $('.currently-playing .artist-name').text(currentSongFromAlbum.artist);

    
    $('.main-controls .play-pause').html(playerBarPauseButton);
};


// think of it like next-button on a photo carousel

var nextSong = function() {
    // need currentPlayingSongNumber - store in var previousSong?
    // use trackIndex(), pass in currentAlbum, currentPlayingSongNumber ---> 
    // returns index then need a function to increment the var
    // if trackIndex is higher than number of elements (album.length), set trackIndex = 0
    // for loop - trackIndex < album.length; i++ 
    // set currentlyPlayingSongNumber = currentSongFromAlbum
    // updatePlayerBarSong();
    // $('.song-item-number).html(previousSong);
    // $('.song-item-number).html(pauseButtonTemplate);
    
    var previousSong = currentlyPlayingSongNumber;
    
    var currentIndex = trackIndex(currentAlbum, currentlyPlayingSongNumber);
    
    currentIndex++;
     
   if (currentIndex >= currentAlbum.songs.length) {
       currentIndex = 0;
   }
    
    currentlyPlayingSongNumber = currentIndex + 1; 
    
    updatePlayerBarSong;
    
    
};


// if no song is playing, on click, set the songItem innerHTML to the pause button and set current song to the song item's data song number
    
// else if the clicked song IS playing/active, on click, change the innerHTML to the play button and erase current song data by setting to null 

// else if the clicked song is not active (currently playing != songItem), on click, create new var (currentlyPlayingSongElement) with value of active song (use query selector to find by class data-song-number= currentlyPlayingSong), set the active song's innerHTML to its song number, set new song's innerHTML to pauseButton, set currentlyPlayingSong to songItem's song-number


var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);

});


