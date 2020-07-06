# Bitcoin address generator

This is to generate Bitcoin HD Segwit address and P2SH address

## How to run ?

-   Install lerna "npm i -g lerna ts-node yarn" 
-   "lerna bootstrap" to bootstrap all the workspaces in the root directory
-   "lerna run dev" to start both backend and frontend in the root directory
-   http://localhost:8000/ to access the web page

## Code structure descriptions

-   Used lerna & yarn workspace to manage multiple projects in a code base.
-   The "backend" package is to generate bitcoin HD Segwit & P2SH address implemented by @nodejs, @swagger https://swagger.io/ ,etc.
-   The "frontend" package is for visulization implemented by @Antd https://ant.design/index-cn @Umi https://umijs.org/ ,etc.

## scripts descriptions

-   Exec `yarn install` or `lerna bootstrap` in the root directory to initial workspaces.
-   Exec `yarn init -y` to init a new specific workspace/project.
-   Exec `yarn build` in the root directory to build the code.
-   Exec `yarn clean` to clean the compiled code in all the workspaces.
-   Exec `lerna clean` to clean node_modules for all the workspaces.
-   Exec `yarn test` to run tests in all the workspaces.
-   Exec `lerna publish --no-git-tag-version` to publish packages if neccessary.
-   Exec `yarn workspaces info [--json]` to display dependency tree for workspaces.

## Code style & formatter

Using eslint as automated code lint since tslint is deprecated.
Using prettier to format code. 

-   For vs code users, it is recommended to install eslint, prettier plugins in vs code. 
-   Exec `yarn format` to format code (.ts,.js)
-   Exec `yarn lint` to scan code.
