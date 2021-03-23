
import { ScrapeCoaches } from '../../../../../support/index'
describe(`Colorado State-Pueblo Men's Cross Country`, () => {
  it(`Fetches Colorado State-Pueblo Men's Cross Country Coaches`, () => {
    ScrapeCoaches(`https://gothunderwolves.com/sports/cross-country/coaches`, `csup`, `cross-country`)
  })
})