
var Botkit = require('botkit');

var controller = Botkit.slackbot({
  debug: false
  //include "log: false" to disable logging
  //or a "logLevel" integer from 0 to 7 to adjust logging verbosity
});

// connect the bot to a stream of messages
controller.spawn({
  //token: process.env.ALTCODETOKEN,
  token: 'xoxb-87992197655-VxQuZsKc2LDrur8ENZNwiKT6',
  //token : 'xoxb-91906944081-KAV86vjqXQ7mQPz1dMRRr4yQ',
}).startRTM()



var config = require('./mock.json');




var Isconstraintonday;
var Isconstraintontime;


//coversation to schedule new meeting begins here
controller.hears(['^schedule$', '^setup$'],['mention', 'direct_mention'], function(bot,message) {
  var approxMeetingDuration_Hours = 0;
  var approxMeetingDuration_Mins = 0;

  //Contains all email ids
  var arrayID;
  var meetinghh;
  var meetingmm;
  var meetingday;
  var daythis;
  var meetingID;
  var slots;
  var meetingslot;
  var duration;
  var slotpassed;


  var byTime_Hour;
  var byTime_Minute;

  var byDate;
  var byMonth;
  var byYear;
  var arrayID;

  var getIDOfAttendees = function(err, convo){
    convo.ask('Alright. May I know the email IDs of the attendees, please?',function(response,convo) {
      var IDofAttendees = response.text;
      //
      //convo.say('Cool, you said: ' + response.text);
      var flag=false;

      arrayID = IDofAttendees.split(" ");
      if(IDofAttendees.indexOf(',') > -1){
        arrayID = IDofAttendees.split(",");
      }
      for(var i = 0 ; i < arrayID.length ; i++){
        arrayID[i] = arrayID[i].trim();

        if(JSON.parse(JSON.stringify(config["users"][arrayID[i]]== null)))
        {
          convo.say('Employee '+arrayID[i]+' is not there in the database');
          flag=true;
          break;

        }
      }
      if(flag==false)
      {
        getApproxMeetingDuration(response, convo);
        convo.next();
      }
      else{
        getIDOfAttendees(response, convo);
        convo.next();
      }

    });
  };

  var getApproxMeetingDuration = function(err, convo){
    convo.ask('OK. What will be the approximate duration of the meeting (HH:MM or HH)?',function(response,convo) {
      var approxMeetingDuration = response.text;
      if(approxMeetingDuration > 0 && approxMeetingDuration<3)
      {

        var approxDurationArray = approxMeetingDuration.split("");
        if(approxMeetingDuration.indexOf(":") > -1){
          approxDurationArray = approxMeetingDuration.split(":");
        }

        approxMeetingDuration_Hours = parseInt(approxDurationArray[0]);
        if(approxDurationArray.length == 2){
          approxMeetingDuration_Mins = parseInt(approxDurationArray[1]);
        }

        //check if valid email addresses are entered

        getLastDateOrDay(response, convo);
        convo.next();
      }
      else
      {
        convo.say('Meeting can not be schedule for more than 3 hrs! Please try again');
        getApproxMeetingDuration(response, convo);
        convo.next();
      }
    });
  };

  var getLastDateOrDay = function(err, convo){
    convo.ask('And by what date(MM/DD/YYYY or MM/DD or DD) or day do you want the meeting to be scheduled? Say NA if no such constraint',function(response,convo) {
      if(response.text=='na'||response.text=='Na'||response.text=='NA')
      {
        Isconstraintonday=false;
      }else{
        Isconstraintonday=true;
        lastDate = response.text;


        //today's date and time
        var today = new Date();

        //user's specified date
        var dateArray = lastDate.split(" ");
        if(lastDate.indexOf("/") > -1)
          dateArray = lastDate.split("/");

        byDate = today.getDate();
        byMonth = today.getMonth();
        byYear = today.getYear();

        if(dateArray[0].match(/[0-9]+/)){//It's a number
          if(dateArray.length == 1){
            byDate = parseInt(dateArray[0]);
            if(byDate < today.getDate()){
              convo.say("I can't organize a meeting in the past! Please try again.");
              getLastDateOrDay(response, convo);
              convo.next();
              return;
            }
          }else if(dateArray.length == 2){
            byDate = parseInt(dateArray[1]);
            byMonth = parseInt(dateArray[0]);
            if(byMonth < today.getMonth() || byDate < today.getDate()){
              convo.say("I can't organize a meeting in the past! Please try again.");
              getLastDateOrDay(response, convo);
              convo.next();
              return;
            }
          }else{
            byDate = parseInt(dateArray[1]);
            byMonth = parseInt(dateArray[0]);
            byYear = parseInt(dateArray[2]) - 1900;
            if(byYear < today.getYear() || (byYear === today.getYear() && (byMonth < today.getMonth()) || (byYear === today.getYear() && byMonth === today.getMonth() && byDate < today.getDay()))){
              convo.say("I can't organize a meeting in the past! Please try again.");
              getLastDateOrDay(response, convo);
              convo.next();
              return;
            }
          }
          // convo.say("i got " + byDay + " " + byMonth + " " + byYear);
        }else if(dateArray[0].toUpperCase() === "SUNDAY"){
          byDate += today.getDay() > 0 ? 7 - today.getDay() : 7;
        }else if(dateArray[0].toUpperCase() === "MONDAY"){
          byDate += today.getDay() >= 1 ? 7 - today.getDay() + 1: 1 - today.getDay();
        }else if(dateArray[0].toUpperCase() === "TUESDAY"){
          byDate += today.getDay() >= 2 ? 7 - today.getDay() + 2: 2 - today.getDay();
        }else if(dateArray[0].toUpperCase() === "WEDNESDAY"){
          byDate += today.getDay() >= 3 ? 7 - today.getDay() + 3: 3 - today.getDay();
        }else if(dateArray[0].toUpperCase() === "THURSDAY"){
          byDate += today.getDay() >= 4 ? 7 - today.getDay() + 4: 4 - today.getDay();
        }else if(dateArray[0].toUpperCase() === "FRIDAY"){
          byDate += today.getDay() >= 5 ? 7 - today.getDay() + 5: 5 - today.getDay();
        }else if(dateArray[0].toUpperCase() === "SATURDAY"){
          byDate += today.getDay() >= 6 ? 7 - today.getDay() + 6: 6 - today.getDay();
        }else if(dateArray[0].toUpperCase() === "TODAY"){
          byDate = today.getDate();
        }else if(dateArray[0].toUpperCase() === "TOMORROW"){
          byDate = today.getDate() + 1;
        }

        if(byMonth === 1 || byMonth ===  3 || byMonth === 5 || byMonth === 8 || byMonth === 10){
          if(byMonth === 1){
            if(today.getYear() % 4 === 0 && byDate > 28){
              byDate -= 28;
              byMonth++;
            }else if(today.getYear() % 4 !== 0 && byDate > 29){
              byDate -= 29;
              byMonth++;
            }
          }else{
            if(byDate > 30){
              byDate -= 30;
              byMonth++;
            }
          }
        }else if(byMonth === 0 || byMonth === 2 || byMonth === 4 || byMonth === 7 || byMonth === 9){
          if(byDate > 31){
            byDate -= 31;
            byMonth++;
          }
        }else{
          if(byDate > 31){
            byDate -= 31;
            byMonth = 1;
            byYear++;
          }
        }
      }
      // convo.say("i got " + byDate + " " + byMonth + " " + byYear);

      getLastTime(response, convo);

      convo.next();
    });
  };

  var getLastTime = function(err, convo){
    convo.ask('OK. By what time (HH:MM or HH) should the meeting be organized (24 Hour format)? Say NA if no such constraint',function(response,convo) {
      if(response.text.toUpperCase='NA')
      {
        Isconstraintonday=false;
      }else{

        lastTime = response.text;

        //today's date and time
        var today = new Date();
        //user's specified date
        var timeArray = lastTime.split(" ");
        if(lastTime.indexOf(":") > -1)
          timeArray = lastTime.split(":");

        byTime_Hour = parseInt(timeArray[0]);
        byTime_Minute = 0;

        if(timeArray.length == 2)
          byTime_Minute = parseInt(timeArray[1]);

        if(byDate === today.getDate() || byDate === today.getDate() + 1){

          var meetingDurationInMin = approxMeetingDuration_Hours * 60 + approxMeetingDuration_Mins;

          var timeLeftInMin = (new Date(1900 + byYear, byMonth, byDate, byTime_Hour, byTime_Minute, 0, 0) - new Date()) / (1000 * 60);
          // console.log(new Date(1900 + byYear, byMonth, byDate, byTime_Hour, byTime_Minute, 0, 0));
          // console.log(new Date());
          convo.say("Time Left: " + timeLeftInMin);
          if(timeLeftInMin < meetingDurationInMin){
            HandleInsufficientTime(response, convo);
            convo.next();
            return;
          }
        }
      }


      var today = new Date();
      var dd = today.getDate();
      var mm = today.getMonth()+1; //January is 0!
      var yyyy = today.getFullYear();
      var hh=today.getHours();
      var mint=today.getMinutes();
      var slotthis;

      if(hh>17){
        dd=dd+1;
        slotthis=0;
      }else if(hh<10){
        slotthis=0;
      }else{
        hh=hh-10;
        slotthis=hh*2;
      }
      if((mint>0)&&(mint<30)){
        slotthis++;
      }else{
        slotthis=slotthis+2;
      }
      if(slotthis==15||((slotthis+slots)>=16)){
        dd=dd+1;
        slotthis=0;
      }


      if(dd<10) {
        dd='0'+dd;
      }

      if(mm<10) {
        mm='0'+mm;
      }



      if((byYear<yyyy)||(byYear==yyyy&byMonth<mm)||(byYear==yyyy&&byMonth==mm&&byDay<dd)){
        //not possible
      }
      today = yyyy+'-'+dd+'-'+mm;
      var daythis=today;
      var slots=parseInt(approxMeetingDuration_Hours)*2;
      var basepos=0;
      var tempbasepos;
      if(parseInt(approxMeetingDuration_Mins)>30)
      {
        slots=slots+2;
      }else if(parseInt(approxMeetingDuration_Mins)<30&&parseInt(approxMeetingDuration_Mins)>0) slots=slots+1;



      var result=calculateCommonTime(arrayID,daythis,slotthis,slots);
      if(result>=0){
        duration=slots;
        meetingslot=result;
        meetingday=daythis;
        meetinghh=(10+(meetingslot/2));
        meetingmm='00';
        if((meetingslot%2)!=0){
          meetinghh=(10+(meetingslot/2))-0.5;
          meetingmm='30';
        }
        var meeting=daythis.split('-');
        if(((meeting[0]-1900)>byYear)||((meeting[0]==byYear)&&(meeting[2]>byMonth))||((meeting[0]==byYear)&&(meeting[2]==byMonth)&&(meeting[1]>byDate))){
          convo.say("Apologies. I could not find any time suitable in given period");
        }else {
          convo.say("I got " + meetingday + " at " + meetinghh + ":" + meetingmm);
          fixMeeting(response, convo);
          convo.next();
        }
      }

      //convo.say("i got day" + " " + meetingday + " at " + meetinghour+ " and  " + meetingmin+" mins");

      //var meeting = OrganizeOptimalMeeting();

      //convo.say("Your meeting details are as follow: " + meeting);

      convo.next();

    });
  };

  var fixMeeting = function(err, convo){
    convo.ask('Do you want to fix this meeting time? Please reply "yes" or "no"',function(response,convo) {
      var answer = response.text;
      if((answer=='no')||(answer=='No')||(answer=='NO')){
        bot.startConversation(message, getLastTime);
        convo.next();
      }else{
        //convo.say('I am confirming this meeting ');
        bot.reply(message, 'I am confirming this meeting ');
        //code for writing meeting id
        var keys=Object.keys(config["meetings"]);
        var last=keys[keys.length-1];
        last++;
        meetingID=last;
        //sets meeting ID based on incrementing most recent meeting ID from JSON
        bot.reply(message, 'This is your meeting ID : '+last);
        config["meetings"][last]=meetingday+"|"+meetinghh+":"+meetingmm;
        var i;
        var j;
        //set meeting ID to calendar
        for(i=0;i<arrayID.length;i++){
          var username=arrayID[i];
          for(j=meetingslot;j<(meetingslot+duration);j++) {
            config["users"][username][meetingday][j]=meetingID;
            console.log("value is : "+config["users"][username][meetingday][j]);
          }
        }
        fs = require('fs');
        var m = JSON.parse(fs.readFileSync('./mock.json').toString());
        fs.writeFile('./mock.json', JSON.stringify(config));
      }
      convo.next();
    });
  };

  var calculateCommonTime=function(arrayID,daythis,slotthis,slots){
    if (slotthis == 15 || ((slotthis + slots) >= 16)) {
      var dayhere = daythis.split("-");
      yyyy = dayhere[0];
      dd = dayhere[1] + 1;
      mm = dayhere[2];
      if ((dd == '32') || ((dd == '31') && ((mm == '02') || (mm == '06') || (mm == '09') || (mm == '11'))) || ((dd = '29') && (mm == '02'))) {
        dd = 1;
        mm = mm + 1;
        if (mm = 13) {
          mm = 1;
          yyyy = yyyy + 1;
        }
      }
      slotthis = 0;
      daythis = yyyy + '-' + dd + '-' + mm;
    }
    var slotpassed=calculateFreeTime(arrayID[0],daythis,slotthis,slots);
    while(slotpassed<0) {
      slotthis = slotthis + 1;
      if (slotthis == 15 || ((slotthis + slots) >= 16)) {
        var dayhere = daythis.split("-");
        yyyy = dayhere[0];
        dd = dayhere[1] + 1;
        mm = dayhere[2];
        if ((dd == '32') || ((dd == '31') && ((mm == '02') || (mm == '06') || (mm == '09') || (mm == '11'))) || ((dd = '29') && (mm == '02'))) {
          dd = 1;
          mm = mm + 1;
          if (mm = 13) {
            mm = 1;
            yyyy = yyyy + 1;
          }
        }
        slotthis = 0;
        daythis = yyyy + '-' + dd + '-' + mm;
      }
      slotpassed = calculateFreeTime(arrayID[0], daythis, slotthis, slots);
    }
    var check=checkforthistime(arrayID,daythis,slotpassed,slots);
    if(check>=0){
      return slotpassed;
    }
    else{
      slotthis=slotthis+1;
      calculateCommonTime(arrayID,daythis,slotthis,slots);
    }


  }
  var calculateFreeTime = function(username,daythis,slotthis,slots){
    var count=0;
    var basepos=slotthis;
    var i;
    var data;

    for(i=slotthis;i<16-slots;i++)
    {
      if(count==slots){
        break;
      }
      data = JSON.parse(JSON.stringify(config["users"][username][daythis][i]));
      if(parseInt(data)==0){
        count++;
      }else{
        count=0;
      }

    }
    if(count==slots){

      return (i-slots);
    }else return -1;

  }

  var checkforthistime=function(arrayID,daythis,slotpassed,slots){
    var check=true;
    var i;
    var k;
    var slottocheck;
    for(k=0;k<(arrayID.length-1);k++) {
      slottocheck=slotpassed;
      for (i = 0; i < slots; i++) {
        var username = arrayID[k + 1];
        data = JSON.parse(JSON.stringify(config["users"][username][daythis][slottocheck]));
        if (parseInt(data) == 0) {
          slottocheck++;

        } else {
          check=false;
          break;
        }
      }
      if(check==false){
        break;
      }
    }
    if(check==true){
      return 1;
    }else return -1;
  }

  var HandleInsufficientTime = function(err, convo){
    convo.ask("Not enough time! Please select one of the two choices: \n1. Enter new Date\n2. Enter new time.",function(response,convo) {
      var choice = response.text;

      if(choice === '1'){
        getLastDateOrDay(response, convo);
      }else if(choice === '2'){
        getLastTime(response, convo);
      }else {
        convo.say("Incorrect value. Please try again.");
        HandleInsufficientTime(response, convo);
      }

      convo.next();
      return;
    });
  };

  var OrganizeOptimalMeeting = function(){

  }

  // start a conversation with the user.
  bot.startConversation(message, getIDOfAttendees);

  bot.reply(message, "Let's organize a new meeting.");

});

//coversation to add new member to a meeting
controller.hears(['^Add$', '^new$'],['mention', 'direct_mention'], function(bot,message) {
  var newAttendeeIDs;
  var meetingID;

  var getIDOfNewAttendee = function(err, convo){
    convo.ask('May I know the email IDs of the new attendees, please?',function(response,convo) {
      newAttendeeIDs = response.text.split(" ");

      getIDOfMeeting(response, convo);

      convo.next();
    })
  };

  var getIDOfMeeting = function(err, convo){
    convo.ask('Alright. What is the meeting ID?',function(response,convo) {
      meetingID = response.text;

      adjustMeeting();

      convo.say("Members Added");

      convo.next();
    })
  };

  var adjustMeeting = function(){
    //
  };

  // start a conversation with the user.
  bot.startConversation(message, getIDOfNewAttendee);

  bot.reply(message, "Let's add the new member to the meeting.");
});

//coversation to remove a member from meeting
controller.hears(['^remove$'],['mention', 'direct_mention'], function(bot,message) {

  var userRequestingRemoval = message.user;

  var IDOfAttendeesToRemove;
  var meetingID;

  var getIDOfAttendeeToRemove = function(err, convo){
    convo.ask('May I know the email ID of the attendee, please?',function(response,convo) {
      IDOfAttendeesToRemove = response.text.split(' ');

      getIDOfMeeting(response, convo);

      convo.next();
    })
  };

  var getIDOfMeeting = function(err, convo){
    convo.ask('Alright. What is the meeting ID?',function(response,convo) {
      meetingID = response.text;

      // if(userRequestingRemoval in meeting.getUsers()) //Some type of validaion required here.
      confirmRemoval(response, convo);
      // else
      // convo.say("You are not authorized for this action.");

      convo.next();
    })
  };

  var confirmRemoval = function(err, convo){
    convo.ask('Are you sure you want to remove the member from the meeting?',function(response,convo) {
      var confirmation = response.text;

      if(confirmation.toUpperCase() === "YES"){
        removeMembersFromMeeting();
        covo.say("Members removed.");
      }else{
        convo.say("Members NOT removed.");
      }

      convo.next();
    })
  };

  var removeMembersFromMeeting = function(){
    //
  };

  // start a conversation with the user.
  bot.startConversation(message, getIDOfAttendeeToRemove);

  bot.reply(message, "Let's remove the member from the meeting.");
});

//coversation to cancel the meeting
controller.hears(['^deschedule$', '^cancel$'],['mention', 'direct_mention'], function(bot,message) {

  var cancellationRequestingUser = message.user;

  var meetingID;

  var getIDOfMeeting = function(err, convo){
    convo.ask('May I know the meeting ID?',function(response,convo) {
      meetingID = response.text;

      // if(cancellationRequestingUser in meeting.getUsers()) //Some type of validaion required here.
      confirmCancellation(response, convo);
      // else
      // convo.say("You are not authorized for this action.");
      convo.next();
    })
  };

  var confirmCancellation = function(err, convo){
    convo.ask('Are you sure you want to cancel the meeting?',function(response,convo) {
      var confirmation = response.text;

      if(confirmation.toUpperCase() === "YES"){
        cancelMeeting();
        convo.say("Meeting has been cancelled.");
      }else{
        convo.say("Meeting NOT cancelled.");
      }

      convo.next();
    })
  };

  var cancelMeeting = function(){
    //
  };

  // start a conversation with the user.
  bot.startConversation(message, getIDOfMeeting);

  bot.reply(message, "Let's cancel the meeting.");
});

//coversation to reschedule the meeting
controller.hears(['^reschedule$'],['mention', 'direct_mention'], function(bot,message) {

  var rescheduleRequestingUser = message.user;

  var meetingID;

  var getIDOfMeeting = function(err, convo){
    convo.ask('May I know the meeting ID?',function(response,convo) {
      meetingID = response.text;

      // if(cancellationRequestingUser in meeting.getUsers()) //Some type of validaion required here.
      confirmReschedule(response, convo);
      // else
      // convo.say("You are not authorized for this action.");
      convo.next();
    })
  };

  var confirmReschedule = function(err, convo){
    convo.ask('Are you sure you want to reschedule the meeting?',function(response,convo) {
      var confirmation = response.text;

      if(confirmation.toUpperCase() === "YES"){
        cancelMeeting();
        convo.say("Meeting has been rescheduled.");
      }else{
        convo.say("Meeting NOT rescheduled.");
      }

      convo.next();
    })
  };

  var cancelMeeting = function(){
    //
  };

  // start a conversation with the user.
  bot.startConversation(message, getIDOfMeeting);

  bot.reply(message, "Let's cancel the meeting.");
});

