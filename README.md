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

If I understood what the AI was trying to write correctly, this is the demo it was trying to create:

![screenshot.gif](screenshot.gif)

## Quick Start
```bash
> npx http-server -p 8000
```
