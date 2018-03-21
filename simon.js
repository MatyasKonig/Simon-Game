(function(){
//all global variables
var
  bigButton = "",
  colorPattern = [], //an array that holds the randomly generated numbers
  currentLevel = 0, //holds the value for curent level
  delLoopCounter = 0,
  gameInProgress = false; //checks whether game is in progress
  maxLevel = 0, //holds the value for maximum level achieved
  power = false, //power switch
  powerButton = document.getElementById("powerButton"),
  readyForUser = false, //checks whether it is users time to shine
  startButton = document.getElementById("startButton"),
  userClicks = 0, //holds number of clicks user performed this round
  activeVol = "noVolume",
  vol = 0,
  soundSources = ["assets/sound/CEP_El_note.mp3","assets/sound/CEP_A_note.mp3","assets/sound/CEP_C_note.mp3","assets/sound/CEP_E_note.mp3"],
  noSoundButton = document.getElementById("noVolume"),
  lowSoundButton = document.getElementById("lowVolume"),
  mediumSoundButton = document.getElementById("mediumVolume"),
  highSoundButton = document.getElementById("highVolume"),
  playing = [], //This will be our play index, so we know which version has been played the last.
  sounds = [], //This will be a matrix of all the sounds
  numberSounds = 5; //The number of sounds to preload. This depends on how often the sounds need to be played, but if too big it will probably cause lond loading times.

// Pre-loading audio files for buttons
for (i = 0; i < numberSounds; i ++) //We need to have numberSounds different copies of each sound, hence:
   sounds.push([]);

for (i = 0; i < soundSources.length; i ++)
   for (j = 0; j < numberSounds; j ++)
       sounds[j].push(new Audio(soundSources[i])); //Assuming that you hold your sound sauces in a "sources" array, for example ["bla.wav", "smile.dog" "scream.wav"]

for (i = 0; i < soundSources.length; i ++)
   playing[i] = 0;

//Turn the game ON, OFF, and reset the game after failed attempt
function simonPower() {
  if (power) {
    powerOff();
  } else {
    powerOn();
  }
  startToggle();
}
  function powerOn() {
    defaultVariableValues();
    startupColors();
    console.log("Game has been turned ON");
    colorChange(activeVol, "active")
  }

  function powerOff() {
    power = false;
    colorChange(activeVol, "active")
    currentLvlUpdate();
    maxLvlUpdate();
    console.log("Game has been turned OFF");
  }

  function simonReset() {
    defaultVariableValues();
    console.log("Simon has been restarted");
  }

    function defaultVariableValues() {
      currentLevel = -1;
      colorPattern = [];
      gameInProgress = false;
      power = true;
      readyForUser = true;
      userClicks = 0;
      maxLvlUpdate();
      currentLvlUpdate();
    }

//Color patter generation
function newRound() {
  addRnd();
  userClicks = 0;
  delLoopCounter = 0;
  readyForUser = false;
  currentLvlUpdate();
  simonButtonLog();
}

  function addRnd() {
    colorPattern.push(getRnd());
  }

    function getRnd() {
      return Math.floor(Math.random() * 4) + 1;
    }

//compare each button press with the randomly generated numbers
function compare(x) {
  if (readyForUser && userClicks < colorPattern.length - 1) {
    if (x == colorPattern[userClicks]) {
      console.log("Correct Answer");
      userClicks ++;
    } else {
      setTimeout(gameOver,500);
    }
  } else if (readyForUser && userClicks == colorPattern.length - 1) {
    if (x == colorPattern[userClicks]) {
      console.log("All Answers Correct");
      maxLvlUpdate();
      setTimeout(simonContinue, 1000);
    } else {
      setTimeout(gameOver,500);
    }
  } else if (!readyForUser) {
     console.log("not ready for user interaction");
  } else {
    console.log("Error: something went wrong during function compare()");
  }
}

/**********
Level handlers
***********/
function currentLvlUpdate() {
  if (power) {
    currentLevel ++;
    document.getElementById('currentLevel').innerHTML = currentLevel;
  }
  if (!power) {
    document.getElementById('currentLevel').innerHTML = "";
  }

}

function maxLvlUpdate() {
  if (currentLevel != -1 && maxLevel < currentLevel && power) {
    maxLevel ++;
    storeMaxLevel(maxLevel,100);
    document.getElementById('maxLvl').innerHTML = maxLevel;
  } else if (currentLevel == -1 && power) {
    maxLevel = checkStoredMaxLevel();
    document.getElementById('maxLvl').innerHTML = maxLevel;
  } else if (!power) {
    document.getElementById('maxLvl').innerHTML = "";
  }
}

/*******
Game flow handler
********/
function simonStart() {
  if (power === true && !gameInProgress) {
    newRound();
    gameInProgress = true;
  } else if (!power){
    console.log("power is off");
  } else {
    console.log("Error: something went wrong during function simonStart()");
  }
}

  /* This function exists because pressing the start button multiple
     times during game would break Simon. This function is not linked
     to simonStart button.*/
  function simonContinue() {
    if (power === true) {
      newRound();
    } else {
      console.log("power is off");
    }
  }

//id in the sounds[i] array., vol is a real number in the [0, 1] interval
var playSound = function(id) {
  if (vol <= 1 && vol >= 0)
     sounds[playing[id]][id].volume = vol;
  else
     sounds[playing[id]][id].volume = 1;

  if (vol != 0) {
    sounds[playing[id]][id].play();
    ++ playing[id]; //Each time a sound is played, increment this so the next time that sound needs to be played, we play a different version of it,
  }

  if (playing[id] >= numberSounds)
     playing[id] = 0;
}

var soundsControl = function(volume) {
  vol = volume;
}

/*
Buttons changing colors
*/
function colorChange(elementID, newClass) {
  document.getElementById(elementID).classList.toggle(newClass);
}

  function buttonBlink(elementID, newClass, blinkSpeed) {
    colorChange(elementID, newClass);
    setTimeout(colorChange, blinkSpeed, elementID, newClass);
    playSound(elementID - 1);
  }

    function startupColors() {
      var blinkSpeed = 250, delay = blinkSpeed - 50;
      setTimeout(buttonBlink, delay * 0, 1,"active", blinkSpeed);
      setTimeout(buttonBlink, delay * 1, 2,"active", blinkSpeed);
      setTimeout(buttonBlink, delay * 2, 3,"active", blinkSpeed);
      setTimeout(buttonBlink, delay * 3, 4,"active", blinkSpeed);
      setTimeout(buttonBlink, delay * 4, 1,"active", blinkSpeed);
      setTimeout(buttonBlink, delay * 5, 2,"active", blinkSpeed);
      setTimeout(buttonBlink, delay * 6, 3,"active", blinkSpeed);
      setTimeout(buttonBlink, delay * 7, 4,"active", blinkSpeed);
    }

    function pressButton(buttonID) {
      if (power && readyForUser) {
        compare(buttonID);
        buttonBlink(buttonID,"active",300);
      }
    }

    var soundButton = function(buttonID) {
      if (activeVol !== buttonID && power) {
        colorChange(activeVol,"active");
        colorChange(buttonID,"active");
        activeVol = buttonID;
      }
    }

    var simonButtonLog = function() {
      if (power) {
        var speed = 900 - (currentLevel * (currentLevel * 5));
        var userInactivity;
        if (speed <= 300) {
          userInactivity = 300 * currentLevel;
        } else {
          userInactivity = speed * currentLevel;
        }
        for (var i = 0; i < colorPattern.length; i++) {
          setTimeout(buttonBlink, (i + 1) * (speed <= 300 ? 300 : speed), colorPattern[i], "active", currentLevel > 9 ? 150 : 300);
        }
        setTimeout(settingUserReady, userInactivity);
      }
    }

    /* Not an optimal way to iterate through colorPattern array...but I gave up on trying to find the best solution. If you are looking at this and know how to do it, contact me at mchlebovsky@icloud.com. I will be super grateful. Actually found a temporary solution that is being tested. If you see a problem with the current solution (located above) contact me */

    // function simonButtonLog1() {
    //   if (power) {
    //     var speed = 900 - (currentLevel * (currentLevel * 5));
    //     var userInactivity;
    //     if (speed <= 300) {
    //       userInactivity = 300 * currentLevel;
    //     } else {
    //       userInactivity = speed * currentLevel;
    //     }
    //     setTimeout( function nestedLog1() {
    //       buttonBlink(colorPattern[delLoopCounter],"active",currentLevel > 9 ? 150 : 300);
    //       delLoopCounter++;
    //       if (delLoopCounter < colorPattern.length) {
    //         simonButtonLog();
    //       }
    //       setTimeout(settingUserReady, userInactivity);
    //     }, speed <= 300 ? 300 : speed)
    //   }
    // }

    function settingUserReady() {
      readyForUser = true;
    }

    function gameOver() {
      if (readyForUser) {
        readyForUser = false;
        buttonBlink(1,"over",500);
        buttonBlink(2,"over",500);
        buttonBlink(3,"over",500);
        buttonBlink(4,"over",500);
        setTimeout(buttonBlink, 1000, 1, "over", 500);
        setTimeout(buttonBlink, 1000, 2, "over", 500);
        setTimeout(buttonBlink, 1000, 3, "over", 500);
        setTimeout(buttonBlink, 1000, 4, "over", 500);
        console.log("GAME OVER");
        setTimeout(simonReset, 1500);
      }
    }


/*******
Event Listeners
*********/
for (var i = 1; i <= 4; i++) {
  bigButton = document.getElementById(i + '');
  bigButton.addEventListener("click", function(e){
    e.preventDefault();
    var theNumber = parseInt(this.id);
        pressButton(theNumber);
  });
}

powerButton.addEventListener("click", function(e){
  e.preventDefault();
  simonPower();
})

startButton.addEventListener("click", function(e){
  e.preventDefault();
  simonStart();
})

//classToggles
function startToggle() {
  document.getElementById('powerButton').classList.toggle("active");
  document.getElementById('powerText').classList.toggle("active");
  if (power === false) {
    document.getElementById('powerText').innerHTML = "OFF";
  } else {
    document.getElementById('powerText').innerHTML = "ON";
  }
}

noSoundButton.addEventListener("click", function(e){
  e.preventDefault();
  soundsControl(0);
  soundButton("noVolume");
})

lowSoundButton.addEventListener("click", function(e){
  e.preventDefault();
  soundsControl(.25);
  soundButton("lowVolume");
})

mediumSoundButton.addEventListener("click", function(e){
  e.preventDefault();
  soundsControl(.5);
  soundButton("mediumVolume");
})

highSoundButton.addEventListener("click", function(e){
  e.preventDefault();
  soundsControl(1);
  soundButton("highVolume");
})

/***************
Storing Maximum Level
Checks if the browser supports Local Storege. If not, stores as a Cookie.
key name = record
***************/
var storeMaxLevel = function(cvalue,exdays) {
  if (typeof(Storage) !== "undefined") {
      localStorage.setItem("record", cvalue)
  } else {
    var date = new Date();
    date.setTime(date.getTime() + (exdays*24*60*60*1000));
    var expires = "expiress=" + date.toGMTString();
    document.cookie = "record" + "=" + cvalue + ";" + expires + ";path=/";
  }
}

  var getCookie = function(){
    var name = "record" + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return Number(c.substring(name.length, c.length));
        }
    }
    return "";
  }

  var getLSRecord = function(){
    return Number(localStorage.getItem("record"));
  }

    var checkStoredMaxLevel = function(){
      if (typeof(Storage) !== "undefined") {
        var record = getLSRecord();
        if (record != 0) {
          return record;
        } else {
          return 0;
        }
      } else {
        var record = getCookie();
        if (record != "") {
          return record;
        } else {
          return 0;
        }
      }
    }

})();
