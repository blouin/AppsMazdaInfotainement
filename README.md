# apps_mazda
Applications Mazda

These are apps for my Mazda car built using Custom SDK found here:
http://mazda3revolution.com/forums/2014-2016-mazda-3-skyactiv-audio-electronics/123882-custom-applications-sdk-write-deploy-your-own-applications.html#/forumsite/20910/topics/123882?page=1

Feel free to re-use & modify these.

## Included applications
* app.clock: A full size clock
* app.compass: A full size compass [WORK IN PROGRESS]

## Adjustments 

### Brightness (when in use)
- You can use the controller to adjust brightness. I personnally prefer to "dim" the light when I'm driving at night, so you can turn the wheel CW or CCW to adjust brightness. You can also push the controller to toggle screen on or off.

### Translating application name (in code)
- I'm french speaking, so the app name is also in french. You can change to what you want ~ line 29 of `app.js` file.

### Adjusting time (in code)
- Since I can't get the exact date, I got it from the GPS timestamp. It may take a few seconds before the time adjusts. To convert the GPS date to a local date, the easiest way I found was to "hard code" the hours offset because javascript version did not work. I'm -4 hours off (thus 240 minutes) off from UTC. If you use the app, change the value in `calculateOffset` function of `app.js` file to your specific value. We also switch hours (winter/summer; +/- 1h), so I'll just change the value then. Not the best way, but easy fix to do.
