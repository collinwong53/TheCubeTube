var tag = document.createElement('script');
tag.src = "https://www.youtube.com/iframe_api";
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

function onYouTubeIframeAPIReady(vidId) {
    player = new YT.Player('mainVideo', {
        videoId: vidId || 'zEquj3sj_Pk',
        playerVars: {
            'rel': 0,
            'playsinline':1
        },
        events: {
            'onStateChange': onPlayerStateChange
        }
    });
}

function onPlayerStateChange(event) {
    resetPlaylistTd();

    if (event.data == YT.PlayerState.PLAYING) {
        $('.playButton').removeClass(playFaClass).toggleClass(pauseFaClass);
        $('.tdTitle i.fa').removeClass(faPauseIcon + ' ' + faSpinCircle).addClass(faSpinCircle);

    } else if (event.data == YT.PlayerState.PAUSED) {
        $('.pauseButton').removeClass(pauseFaClass).toggleClass(playFaClass);
        $('.tdTitle i.fa').removeClass(faPauseIcon + ' ' + faSpinCircle).addClass(faPauseIcon);
    } else if (event.data == YT.PlayerState.ENDED) {
        if(playlistVideoObjectArray.length > 0) {
            playNextPlaylistVideo();
        }
        else if(getAutoPlayDirectionValue()){
            playPrevYTVideo();            
        }
        else{
            playNextYTVideo();
        }
    }
}

//Function to play next video and change spinner icon to current video playing
function playNextYTVideo() {
    updateMidNavText();
    if(playlistVideoObjectArray.length > 0){
        playNextPlaylistVideo();
        return
    }   //TEMP  SHOULD HAVE BUTTON THAT DOES THIS INSTEAD

    var currentVideoIndex = videoObjectsToLoad.findIndex(x => x.youtube_video_id === currentlySelectedVideoID);
    //if on the last video of the carousel page
    if((currentVideoIndex+1) % 20 === 0){
        if (videoObjectsToLoad[videoObjectsToLoad.length-1].youtube_video_id === currentlySelectedVideoID){
            //On the very last video in the local video array
            $(".right").click();
            setTimeout(function(){
                next();
            }, 250)
        }else if(currentVideoIndex === -1){
            //in the negative zone
            next()
        }
        else{
            //videos are already loaded on the second page
            $('.carousel').carousel('next');
            next();
        }
    }
    else{
        next();
    }

    function next() {
        var nextVideoIdToLoad = videoObjectsToLoad[currentVideoIndex + 1].youtube_video_id;

        updateVideoInfoPopover(nextVideoIdToLoad);
        updateChannelInfoPopover(videoObjectsToLoad[currentVideoIndex + 1].youtube_channel_id);

        if (getAutoPlayValue()) {
            player.loadVideoById(nextVideoIdToLoad);
        } else {
            player.cueVideoById(nextVideoIdToLoad);
        }
        // player2.cueVideoById(nextVideoIdToLoad);
        currentlySelectedVideoID = nextVideoIdToLoad;

        $('.tdTitle i.fa').remove();
        $(".tdList").removeClass('selectedTd');        
        $("[videoid='" + currentlySelectedVideoID + "'] span:first").before('<i>');
        $("[videoid='" + currentlySelectedVideoID + "'] i:first").addClass('fa fa-circle-o-notch fa-spin fa-fw').css({
            "margin-right": '5px',
            'color': 'green'
        });
        $("[videoid='" + currentlySelectedVideoID + "']").addClass('selectedTd');
    }
}

function playPrevYTVideo() {
    //Does a check to see if on first video and if back button is pressed it prevents it 
    currentVideoIndex = videoObjectsToLoad.findIndex(x => x.youtube_video_id === currentlySelectedVideoID);

    if(currentSlideNumber === 1 && currentVideoIndex === 0) {
        return;
    }
    updateMidNavText();

    //escape function if on first video
    if(currentVideoIndex === 0 && videoObjectsToLoad.length === 40){
        return;
    }

        currentVideoIndex = videoObjectsToLoad.findIndex(x => x.youtube_video_id === currentlySelectedVideoID);

    if(currentVideoIndex % 20 === 0){
        $(".left").click();
    }

    var nextVideoIdToLoad = videoObjectsToLoad[currentVideoIndex - 1].youtube_video_id;

    updateVideoInfoPopover(nextVideoIdToLoad);
    updateChannelInfoPopover (videoObjectsToLoad[currentVideoIndex-1].youtube_channel_id);

    if (getAutoPlayValue()) {
        player.loadVideoById(nextVideoIdToLoad);
    } else {
        player.cueVideoById(nextVideoIdToLoad);
    }
    // player2.cueVideoById(nextVideoIdToLoad);
    currentlySelectedVideoID = nextVideoIdToLoad;

    $('.tdTitle i.fa').remove();    
    $(".tdList").removeClass('selectedTd');
    $("[videoid='" + currentlySelectedVideoID + "'] span:first").before('<i>');
    $("[videoid='" + currentlySelectedVideoID + "'] i:first").addClass('fa fa-circle-o-notch fa-spin fa-fw').css({
        "margin-right": '5px',
        'color': 'green'
    });
    $("[videoid='" + currentlySelectedVideoID + "']").addClass('selectedTd');
}

function getAutoPlayValue() {
    return $("#autoplayCheckBox").is(":checked")
}

function getAutoPlayDirectionValue(){
    // return $("#autoplayOrderCheckBox").is(":checked")
    if(reversePlayDirection == true){
        return true;
    }else{
        return false;
    }

}

function pausePlayWithSpacebar(){
   
    $(window).keypress(function(e) {
        let inputFocus = $("input").is(':focus');
        if(inputFocus == false){
            if (e.which == 32) {
                if (player.getPlayerState() == 2)
                  player.playVideo();
                else
                  player.pauseVideo();
              }
        }

    });
}



/*******needed for iframe player*******/
let iframeRight = 0;
$(window).resize(function () {
    iframeRight = $('#mainVideo').position().left + $('#mainVideo').width();
    $('.lightBoxMode').css('left', iframeRight + 'px');
});

function rendertheatreControls() {
    var lastVideoElement = $('<i>', {
        class: "fa fa-fast-backward fa-3x modalControls lastVideoButton",
        ["data-toggle"]: "tooltip",
        ["data-placement"]: "left",
        ["data-container"]: "body",
        title: "Previous Video"
    });
    var rewindElement = $('<i>', {
        class: "fa fa-undo fa-3x modalControls rewindButton",
        ["data-toggle"]: "tooltip",
        ["data-placement"]: "top",
        ["data-container"]: "body",
        title: "Rewind 15s"
    });
    var playElement = $('<i>', {
        class: "fa fa-play fa-3x modalControls playButton",
        ["data-toggle"]: "tooltip",
        ["data-placement"]: "top",
        ["data-container"]: "body",
        title: "Play"
    });
    var fastForwardElement = $('<i>', {
        class: "fa fa-repeat fa-3x modalControls fastForwardButton",
        ["data-toggle"]: "tooltip",
        ["data-placement"]: "top",
        ["data-container"]: "body",
        title: "Fast Forward 15s"
    });
    var nextVideoElement = $('<i>', {
        class: "fa fa-fast-forward fa-3x modalControls nextVideoButton",
        ["data-toggle"]: "tooltip",
        ["data-placement"]: "right",
        ["data-container"]: "body",
        title: "Next Video"
    });
    


    var closeButton = $('<button>', {
        class: "btn btn-danger modalClose theatreModalClose",
        text: "close",
        type: "button"
    });
    $('.mediaControls').append(lastVideoElement, rewindElement, playElement, fastForwardElement, nextVideoElement);
    
}


