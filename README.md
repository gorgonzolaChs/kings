# Hello Fellow Git-Hubbers,

My name is **gorgonzolaChs**, and me and my pal **orcus50** decided to play around with sockets to create what we think is an awesome game.  

## How to Launch :rocket:

- **'Step 1'** - Host this project on a web server of your choice.

- **'Step 2'** - Connect to that web server.

- **'Step 3'** - cd into the root folder and run `./.start.sh` in the terminal.

- **'Step 4'** - In your browser of choice go to : '[http://SERVER_IP_HERE:3000/client.html](http://SERVER_IP_HERE:3000/client.html)' (Please replace SERVER_IP_HERE with the IP of the server you are hosting on, thanks.  Each player connects on their own computer).

> Or just run server.js

## In Depth Description 

Have you ever wanted to settle and argument through war?  Or desired to test your tactical knowledge in a 2D fight for domination?  Well, have we got the game for you.  Embark on an enticing conquest across the plains of Kings where the stakes are high and strategists prevail.  Gain control of new land and fight for your territory while building defenses and upgrading your unit production.  But watch out for competition, there are others out there that wish to take what is yours.  Be careful out there and have fun on your quest to rule in Kings. 

## Features 

- Can build two types of structures, each of which are costly but provide a considerable bonus.
- If armies are cut off from your capital they will immediately be disbanded.  No army wants to stick around without a way back home after all.  Disbanded armies will appear gray and can be captured by any army for no combat loss.
- Every 30 seconds :
-- Tiles surround entirely by friendly tiles (all 8 spaces) will receive a bonus troop.  
-- A players capital will disperse extra troops to surrounding friendly tiles (all 8 if available).
-- All controlled producers will disperse extra troops to surrounding friendly tiles (all 8 if available).


## Instructions :pencil:

 - **'1'**  :  Mousing over a square that you own and pressing the **'1'** key will spawn a wall at the *cost of 100 units*. This wall increases that tiles defensive bonus for your army.
 
 - **'2'** - Mousing over a square that you own and pressing the **'2'** key will spawn a producer at the cost of 200 units.  Producers can be found naturally spawned around the map as well and will produce a unit every other second.
 
 - **'click and drag'** - Clicking on a tile containing more that one of your own units and dragging your cursor to a desired destination and releasing will cause your selected army to start marching.  Armies will leave 1 man behind every empty tile as to retain control. Armies are also too weak to scale the rough terrain of mountain tiles, so you should probably just have them walk around...
 
 - **'hold space then click and drag'** - Holding down the spacebar and then performing a move command to an adjacent tile will cause the army to split its stack between the two tiles.  Armies can be split to any tile except for mountains because again, they forgot to carb load and are feeling a little weary. Maybe a little combat will liven them up.
 
 - **'Escape'** - All of the commands you send will take time to take effect. You are leading this whole campaign by yourself after-all. Give it some time and eventually your troops should listen.  If you don't feel like waiting around you can always press 'esc' to cancel all previous not performed commands to start fresh and allow for quick decisions to pile up once more.

## **Coming** :soon:

- Learning how to write a README.
