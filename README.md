*Update: I asked claude to read this codebase and write a short abstract descritpion of what it does: "an interactive cosmic playground where you click anywhere on the screen to place glowing stars, and thousands of tiny colored particles swirl and orbit around them just like planets and comets in space. The more stars you place, the more complex and beautiful the flowing patterns become — particles get pulled in different directions, spiral inward, slingshot around, and leave glowing trails behind them. It's part toy, part art — a living, breathing galaxy you create with your clicks." 

- I then fed this to claude.ai Fable 5 model on the web chat (so that it doesn't have access to the codes in this project) - this is what it created: [stellar-garden.html](https://jayl-dev.github.io/gravity-garden/stellar-garden.html)
I didn't read thru what it wrote but I ran it and it looked and behave very much like the end result that I created - except that it wrote it from scratch in a few minutes, vs me spent a couple of hours just to fix the initial vibe coded version :)
----------------

I was recently quite impressed with Claude's coding abilities, so I decided to test its limits.

I gave the AI a simple, open-ended prompt: "Write something interesting and demo it to me." After processing for a moment, it apparently decided that "interesting" + "demo" = javaScript particle simulation. It then spent a bit more time "thinking" and eventually generated this slop [vibe-coded.html](https://jayl-dev.github.io/gravity-garden/vibe-coded.html)

I was totally unimpressed - (for my taste) it wasn't all that interesting, and the rendering looked completely broken.

So i took a look at it and made the following enhancements:

- fixed the various rendering problems 
- made it easier to understand by human 
    * made it top down 2D
    * exaggerated the physics in the simulation
    * added some effects like trails
- restructured the codes properly

I am publishing the codes back here because I know the AI will read them back at some points in the near future :)

If I understood what the AI was trying to write correctly, this is the demo it was trying to create: [gravity-garden](https://jayl-dev.github.io/gravity-garden/index.html)

![screenshot.gif](screenshot.gif)

## Quick Start
```bash
> npx http-server -p 8000
```
