
import { ScrapeCoaches } from '../../../../../support/index'
describe(`USC Football`, () => {
  it(`Fetches USC Football Coaches`, () => {
    ScrapeCoaches(`https://usctrojans.com/sports/football/coaches`, `usc`, `football`)
  })
})