
import { ScrapeCoaches } from '../../../../../support/index'
describe(`Colorado School of Mines`, () => {
  it(`Fetches Mines Football Coaches`, () => {
    ScrapeCoaches(`https://minesathletics.com/sports/football/coaches`, `mines`, `football`)
  })
})