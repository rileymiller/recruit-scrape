
import { ScrapeCoaches } from '../../../../../support/index'
describe(`Colorado State-Pueblo`, () => {
  it(`Fetches Colorado State-Pueblo Coaches`, () => {
    ScrapeCoaches(`https://gothunderwolves.com/sports/football/coaches`, `csup`, `football`)
  })
})