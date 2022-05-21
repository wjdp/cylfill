# cylfill

A tiny app to help with filling air cylinders.

Go to **https://cylfill.wjdp.uk/** to try it out.

## Features

- Runs a countdown for how long a cylinder should take to fill given: size, starting and desired pressure and fill rate.
- Works offline, you just have to visit the URL once.
- Stores state to local storage, you can close and re-open while using the app.
- Stores logs of fills to history, currently only stored locally so not shared with other users.
- Tells you the average fill rate over all time and just today.
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

As the app is aggressively cached by a service worker, used for offline support, you won't get the new version straight away. To do so try the following:

1. Refresh the app
2. Close every instance of the app you have open
3. Re-open the app

# Acknowledgements

- Icons by [Tabler](https://tabler.io/)
