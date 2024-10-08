# Globle with Friends

**Adopted from [Globle by Abe Train](https://github.com/the-abe-train/globle).**

## About This Project

The reason I created this spin-off of Globle is to make a few changes to the visual layout and, more importantly, to add a feature that allows my friends and me to see each other’s scores. We often play the Mini Crossword by NYT Games and love seeing how we rank against one another, so we were disappointed that we couldn’t do the same on the original Globle game.

To solve this, I decided to build on top of the original Globle and implement the feature where we can share and compare our scores with each other, making it a more social experience!

## Listed countries
- The list of countries for this game is the same as that used by [Sporcle](https://www.sporcle.com/blog/2013/01/what-is-a-country/)
- Some alternate spellings and previous names are accepted, e.g. Burma for Myanmar.
- France and UK have many territories scattered throughout the globe, and they confuse the proximity algorithm, so they are not highlighted when those countries are guessed.
- Geography can be a sensitive topic, and some countries' borders are disputed. If you believe a correction should be made, please politely raise an issue or DM me on [Twitter](https://twitter.com/theAbeTrain).

## Tip
If you are really struggling to find the answer, I recommend going to Google Maps or Earth. Better to learn about a new country than never get the answer!

## Attributions
- This game was inspired by Wordle and the "Secret Country" geography games from [Sporcle](https://sporcle.com)
- Country outlines in the Help screen provided by Vemaps.com
- Favicons are from favicon.io

## Features Coming Soon:
- More comprehensive view of personal stats
- Better UI

# Running the project on your local machine
This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app). If you want to run the project on your local machine,
1. Clone this repo
2. `npm install`
3. `npm start`

# License
Shield: [![CC BY-NC-SA 4.0][cc-by-nc-sa-shield]][cc-by-nc-sa]

This work is licensed under a
[Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International License][cc-by-nc-sa].

[![CC BY-NC-SA 4.0][cc-by-nc-sa-image]][cc-by-nc-sa]

[cc-by-nc-sa]: http://creativecommons.org/licenses/by-nc-sa/4.0/
[cc-by-nc-sa-image]: https://licensebuttons.net/l/by-nc-sa/4.0/88x31.png
[cc-by-nc-sa-shield]: https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg
