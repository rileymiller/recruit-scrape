
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado State-Pueblo Baseball`, () => {
  it(`Fetches Colorado State-Pueblo Baseball Coaches`, () => {
    ScrapeCoaches({
      url: `https://gothunderwolves.com/sports/baseball/coaches`,
      division: `d2`,
      conference: `RMAC`,
      school: `Colorado State University-Pueblo (CSUP)`,
      gender: `Mens`,
      sport: `Baseball`,
      path: __dirname
    })
  })
})