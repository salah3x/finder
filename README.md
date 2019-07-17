<div align="center">
  <img src="./src/assets/icon/favicon.png" width="200" alt="Finder Logo" />
  <h2>Finder</h2>

![GitHub release](https://img.shields.io/github/release/salah3x/finder.svg?color=%23f441be)
![GitHub](https://img.shields.io/github/license/salah3x/finder.svg?color=%232196F3)
[![Build Status](https://travis-ci.org/salah3x/finder.svg?branch=master)](https://travis-ci.org/salah3x/finder)

</div>

---

A cross-platform app to share your location and find your friends on the map in real time.

## Development server

- First clone the repo: `git clone git@github.com:salah3x/finder.git`
- Install dependencies for the app (assuming `node`, `npm` and `ionic` are already installed): `cd finder && npm install`
- Run `ionic serve` for a dev server.
- Navigate to `http://localhost:8100/`.

> The app will automatically reload if you change any of the source files.

## Build

Run `ionic build` to build the project. The build artifacts will be stored in the `www` directory.

> Use the `--prod` flag for a production build.

## Web deployment

- Install firebase tools: `npm install -g firebase-tools`
- Authenticate the cli and access Firebase projects: `firebase login`
- Deploy the Ionic PWA to Firebase: `firebase deploy`
  > The deployment phase will automatically lint and build the project first.

## Android/iOS deployment

- First, build the app: `ionic build --prod`
- Next, add the platforms that you'd like to build for:
  ```
  npx cap add ios
  npx cap add android
  ```
  > Upon running these commands, both `android` and `ios` folders at the root of the project are created. These are entirely separate native project artifacts that should be considered part of this app (i.e., check them into source control).
- From the Terminal, run the Capacitor copy command, which copies all web assets into the native iOS project: `npx cap copy`

  > Note: After making updates to the native portion of the code (such as adding a new plugin), use the sync command: `npx cap sync`

- Next, run the Capacitor open command, which opens the native project in Android Studio/Xcode:
  ```
  npx cap open android
  npx cap open ios
  ```
- Change the permissions in each project, generate the build artifacts and push them to the play/app store like you do in a normal Android/iOS project.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Ionic CLI use `ionic help` or go check out the [Ionic CLI README](https://ionicframework.com/docs/cli).

<!-- To get started with firebase go to the [firebase console](https://console.firebase.google.com/) and create your first project. -->

<!-- To get more information about firebase cli use `firebase --help` or visit [the official docs](https://firebase.google.com/docs/cli/). -->

---

This project was generated with [Ionic CLI](https://github.com/ionic-team/ionic-cli) version 5.2.3.
