
import { ScrapeCoaches } from '../../../../../support/index'
describe(`Colorado School of Mines`, () => {
  it(`Fetches Mines Softball Coaches`, () => {
    ScrapeCoaches(`https://minesathletics.com/sports/softball/coaches`, `mines`, `softball`)
  })
})