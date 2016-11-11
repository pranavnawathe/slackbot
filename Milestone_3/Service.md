


### Service
Screencast of the three Use cases:<br>
[Click here to view Use Case-1](https://www.youtube.com/watch?v=iJKLi3-7bOU)<br>
[Click here to view Use case-2](https://www.youtube.com/watch?v=yPi18m9Goi8)<br>
[Click here to view Use case-3](https://www.youtube.com/watch?v=1usrPGGv914) <br>

[The link to the worksheet](https://github.ncsu.edu/gverma/Azra_MeetingBot/blob/master/Milestone_3/worksheet.md)

You can view the use cases [here](https://github.ncsu.edu/gverma/Azra_MeetingBot/blob/master/Milestone%202/Use%20Cases.md)

The functionality of the bot can be divided into three parts:

**1: Create a meeting**<br>
![alt tag](https://github.ncsu.edu/gverma/Azra_MeetingBot/blob/master/Milestone_3/images/CreateMeeting.png)</br>

1. Meeting organizer requests bot to schedule a meeting by providing list of attendees, preferable due date and time(optional).
2. The bot access the calendar of all users using domain specific credential database to calculate optimum time for meeting.
3. With the confirmation from the organizer the bot using Google access token of organizer setups the meeting and invites all the attendees.





**2: Update a meeting**<br>
 Adding a new member to existing meeting 
 ![alt tag](https://github.ncsu.edu/gverma/Azra_MeetingBot/blob/master/Milestone_3/images/UpdateMember.png)</br>


Meeting organizer can add a member to the existing meeting by providing bot with meeting event ID and members’ name/email ID.

1. Meeting organizer requests bot to add a new member to an already existing meeting
2. The bot will update the Meeting Event with this member and send a new invite to this person.







**3: Cancel a meeting**<br>
![alt tag](https://github.ncsu.edu/gverma/Azra_MeetingBot/blob/master/Milestone_3/images/CancelMeeting.png)


Meeting organizer can cancel a meeting by providing bot with meeting event ID.Bot will access the auth token of meeting organizer and deletes the event from the calendar, which will be automatically reflect on all member’s calendar.



