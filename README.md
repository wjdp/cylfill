# cylfill

A tiny app to help with filling air cylinders.

## Features

- Runs a countdown for how long a cylinder should take to fill given: size, starting and desired pressure and fill rate.
- Works offline, you just have to visit the URL once.
- Can be installed to phone home screen.

## Development

- Install dependencies with `npm install`
- Run local copy with `npm run dev`
- Run tests with `npm run test`
- Run type checks with `npm run tsc`

### Pre-Commit

This project uses [pre-commit](https://pre-commit.com/), ensure you have it installed and run `pre-commit install` before making commits.

### Recommended IDE Setup

- [VS Code](https://code.visualstudio.com/) + [Volar](https://marketplace.visualstudio.com/items?itemName=Vue.volar)

## Deployment

This repo deploys its master branch to https://cylfill.wjdp.uk/ using [Cloudflare Pages](https://pages.cloudflare.com/). Branches are deployed to `<branch name>.cylfill.pages.dev`.
