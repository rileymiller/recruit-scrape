
import { ScrapeCoaches } from '../../../../support/index'
describe(`Colorado State-Pueblo Baseball`, () => {
  it(`Fetches Colorado State-Pueblo Baseball Coaches`, () => {
    ScrapeCoaches(`https://gothunderwolves.com/sports/baseball/coaches`, `csup`, `baseball`)
  })
})