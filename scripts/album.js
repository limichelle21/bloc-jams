
var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = currentAlbum.songs[songNumber - 1];
    
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, {
        formats: ['mp3'],
        preload: true
    });
    
    setVolume(currentVolume);
};

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var setVolumeBar = function(volume) {
    var $volumeBar = $('.volume');       
    $volumeBar.find('.fill').width(volume + '%');
    $volumeBar.find('.thumb').css({left: volume + '%'});
}   

var setCurrentTimeInPlayerBar = function(currentTime) {
    $('.seek-control .current-time').html(currentTime);
};

var setTotalTimeInPlayerBar = function(totalTime) {
    $('.seek-control .total-time').html(totalTime);
};


var filterTimeCode = function(timeInSeconds) {
    var totalSeconds = parseFloat(timeInSeconds);
    var minutes = Math.floor(totalSeconds / 60);
    var seconds = Math.floor(totalSeconds % 60);
    var display = minutes + ":"
    
    if (seconds < 10) {
        display += '0';
    }
    display += seconds;
    return display;
};



var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};


var createSongRow = function(songNumber, songName, songLength) {
    var template = 
      '<tr class="album-view-song-item">'
    + ' <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>' 
    + ' <td class="song-item-title">' + songName + '</td>'
    + ' <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
    + '</tr>'
    ;
    
    var $row = $(template);
    
    var clickHandler = function() {
        
        // Set songItem to a Pause button and set currentlyPlayingSong to the songNumber
        // Switch from Pause to Play button to pause currently playing song 
        // Switch from Play to Pause button to indicate new song is playing

        var songNumber = parseInt($(this).attr("data-song-number"));
        
     
        
        if (currentlyPlayingSongNumber !== null) {
            var currentlyPlayingCell = getSongNumberCell(currentlyPlayingSongNumber);
            currentlyPlayingCell.html(currentlyPlayingSongNumber);
        } 
        
        if (currentlyPlayingSongNumber === null || currentlyPlayingSongNumber !== songNumber) {
            setSong(songNumber);
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
            $(this).html(pauseButtonTemplate);
            updatePlayerBarSong();
            setVolumeBar(currentVolume);
        } else if (currentlyPlayingSongNumber === songNumber) {
            if (currentSoundFile.isPaused()) {
                $(this).html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
                currentSoundFile.play();
                updateSeekBarWhileSongPlays();
            } else {
                $(this).html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
                currentSoundFile.pause();
            }
        }
    };
    
    var onHover = function(event) {
        // $(this) refers to a $row 
        var songItem = $(this).find('.song-item-number');
        var songNumber = parseInt(songItem.attr("data-song-number")); 
        // alt: var songNumber = songItem.data("song-number");
            if (songNumber != currentlyPlayingSongNumber) {
                songItem.html(playButtonTemplate)
                };
    };
    
    var offHover = function(event) {
        var songItem = $(this).find('.song-item-number');
        var songNumber = parseInt(songItem.attr("data-song-number")); 

        if (songNumber == currentlyPlayingSongNumber) {
            songItem.html(pauseButtonTemplate)
        } else if (songNumber != currentlyPlayingSongNumber) {
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

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var currentTime = this.getTime();
            var seekBarFillRatio = currentTime / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');                       
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(filterTimeCode(currentTime));
        });
    }
};

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    
    var percentageString = offsetXPercent + '%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({left: percentageString});
};

// parents: .seek-control and .volume
var setupSeekBars = function() {
    var $seekBars = $('.player-bar .seek-bar');
   
        $seekBars.click(function(event) {
            var offsetX = event.pageX - $(this).offset().left;
            var barWidth = $(this).width();
            var seekBarFillRatio = offsetX / barWidth;

        if ($(this).parent().attr('class') == 'seek-control') {
            // seek to time - multiply ratio by total song length
            seek(seekBarFillRatio * currentSoundFile.getDuration());
        } else {
            // seek to vol - multiply ratio by 100 to get value between 0-100
            setVolume(seekBarFillRatio * 100);
        };      
            updateSeekPercentage($(this), seekBarFillRatio);
        });

        $seekBars.find('.thumb').mousedown(function(event) {
            var $seekBar = $(this).parent();
           
            $(document).bind('mousemove.thumb', function(event) {
                var offsetX = event.pageX - $seekBar.offset().left;
                var barWidth = $seekBar.width();
                var seekBarFillRatio = offsetX / barWidth;

                updateSeekPercentage($seekBar, seekBarFillRatio);
            });

            $(document).bind('mouseup.thumb', function() {
                $(document).unbind('mousemove.thumb');
                $(document).unbind('mouseup.thumb');
            }); 
        });
};


var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var updatePlayerBarSong = function() {
  // update text of h2 tags that contain song name and artist name
    // reference current song variables to populate
    // jQuery selectors by class, then update by html, value = current song variables
    
    $('.currently-playing .song-name').text(currentSongFromAlbum.title);
    $('.currently-playing .artist-song-mobile').text(currentSongFromAlbum.title + " - " + currentAlbum.artist);
    $('.currently-playing .artist-name').text(currentAlbum.artist);
    $('.main-controls .play-pause').html(playerBarPauseButton);
    setTotalTimeInPlayerBar(filterTimeCode(currentSongFromAlbum.duration));
};


        // need to know the previous song. use current index as starting point
        // use trackIndex(), pass in currentAlbum, currentSongFromAlbum ---> 
        // returns index then need a function to increment the var
        // if currentIndex is higher than number of elements (album.length), set currentIndex = 0 - return to first song in the album
        // set currentlyPlayingSongNumber = currentSongFromAlbum
        // updatePlayerBarSong();
        // $('.song-item-number).html(previousSong);
        // $('.song-item-number).html(pauseButtonTemplate);


var nextSong = function() {
// if index = 0, the previous song number = last song number
    var previousSongNumber = function(index) {
        return index == 0 ? currentAlbum.songs.length : index;
    }; 
// set currentIndex using trackIndex function
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
// increment the index - move to next song
    currentIndex++;
// at the end of the album, next index should be first index
   if (currentIndex >= currentAlbum.songs.length) {
       currentIndex = 0;
   }
// new current song number is Index + 1 
    var newSongNumber = currentIndex + 1;
    setSong(newSongNumber);
// play new song    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
// update bar information
    updatePlayerBarSong();
    setVolumeBar(currentVolume);
// set the last song's number
    var lastSongNumber = previousSongNumber(currentIndex);
// create variables for next song and prev song elements on page
    var $nextSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
// update html of song elements on page
    $nextSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber); 
        
};



var previousSong = function() {
    var previousSongNumber = function(index) {
// if index == index of last song, previous song number is 1, else index + 1 + 1 for song number       
        return index == (currentAlbum.songs.length - 1) ? 1 : index + 2  
    }; 
    
// set currentIndex
    var currentIndex = trackIndex(currentAlbum, currentSongFromAlbum);
// decrement index - move to previous song until currentIndex = 0
    currentIndex--;
    
// at beginning of album, previous index should be the last index, last song is "before" first song
    if (currentIndex < 0) {
        currentIndex = currentAlbum.songs.length - 1;
    }

// if currentIndex = 1, song number should be 2
    var newSongNumber = currentIndex + 1;
    setSong(newSongNumber);
    
    currentSoundFile.play();
    updateSeekBarWhileSongPlays();
// update bar information    
    updatePlayerBarSong();
    setVolumeBar(currentVolume);
    var lastSongNumber = previousSongNumber(currentIndex);
// create variables for next song and prev song elements on page
    var $previousSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    var $lastSongNumberCell = getSongNumberCell(lastSongNumber);
// update html of song elements on page
    $previousSongNumberCell.html(pauseButtonTemplate);
    $lastSongNumberCell.html(lastSongNumber); 

};

var togglePlayFromPlayerBar = function() {
    var $currentSongNumberCell = getSongNumberCell(currentlyPlayingSongNumber);
    
    if (!currentlyPlayingSongNumber) {
        nextSong();
    } else {
        if (currentSoundFile.isPaused()) {
            $currentSongNumberCell.html(pauseButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPauseButton);
            currentSoundFile.play();
            setVolumeBar(currentVolume);
        } else {
            $currentSongNumberCell.html(playButtonTemplate);
            $('.main-controls .play-pause').html(playerBarPlayButton);
            currentSoundFile.pause();
        }
    }
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
var currentSoundFile = null;
var currentVolume = 80;

var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');

var $playerBarControl = $('.main-controls .play-pause');

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    setupSeekBars();
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playerBarControl.click(togglePlayFromPlayerBar);
});


