
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado State-Pueblo Baseball`, () => {
  it(`Fetches Colorado State-Pueblo Baseball Coaches`, () => {
    ScrapeCoaches({
      url: `https://gothunderwolves.com/sports/baseball/coaches`,
      division: `d2`,
      conference: `rmac`,
      school: `csup`,
      gender: `mens`,
      sport: `baseball`,
      path: __dirname
    })
  })
})