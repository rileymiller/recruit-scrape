
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado State-Pueblo Men's Cross Country`, () => {
  it(`Fetches Colorado State-Pueblo Men's Cross Country Coaches`, () => {
    ScrapeCoaches({
      url: `https://gothunderwolves.com/sports/cross-country/coaches`,
      division: `d2`,
      conference: `rmac`,
      school: `csup`,
      gender: `mens`,
      sport: `cross-country`,
      path: __dirname
    })
  })
})