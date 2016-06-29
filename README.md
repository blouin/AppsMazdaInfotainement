# apps_mazda
Applications Mazda

--- 
These are apps for my Mazda car built using Custom SDK found here:
http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/123882-custom-applications-sdk-write-deploy-your-own-applications.html#/forumsite/20910/topics/123882?page=1

Feel free to re-use & modify these.

---
app.clock: A full size clock
Stuff you need to do / might not work:
- Since I can't get the exact date, I got it from the GPS timestamp. Not sure the app works if your car has no GPS.
- To convert the GPS date to a local date, the easiest way I found was to "hard code" the hours offset because javascript version did not work. I'm -4 hours off (thus 240 minutes) off from UTC. If you use the app, change the value on line 66 of app.js file to your specific value. We also switch hours (winter/summer; +/- 1h), so I'll just change the value then. Not the best way, but easy fix to do.
- I'm french speaking, so the app name is also in french. You can change to what you want on line 26 of app.js file.
