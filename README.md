# FEX(Front End X)

## A playground for exploring various front-end frameworks, supports React, Vue, and other popular front-end frameworks

Just run `pnpm dev`, then modify the code in the corresponding framework's directory—it will automatically switch to that framework.

It also supports other front-end frameworks. Simply create a directory for the new framework in the root folder and ensure it has a `main.tsx` file. Then, you can write code using that framework's language.

For TypeScript and ESLint support, refer to the structure of the React and Vue directories as a guide.

## Why This Project Exists

I often get sudden ideas to write quirky code with Vue and React. Every time I switch frameworks, I have to switch projects and start a new dev server, which feels tedious. I wondered: _Could I run just one dev server but switch between different front-end frameworks?_ In other words, could a single project support multiple frameworks (dev-only) while keeping them neatly organized in a clean directory structure? That’s how this project came to be.
