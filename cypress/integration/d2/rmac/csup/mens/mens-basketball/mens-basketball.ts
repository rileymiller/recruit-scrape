
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado State-Pueblo Men's Basketball`, () => {
  it(`Fetches Colorado State-Pueblo Men's Basketball Coaches`, () => {
    ScrapeCoaches({
      url: `https://gothunderwolves.com/sports/mens-basketball/coaches`,
      division: `d2`,
      conference: `rmac`,
      school: `csup`,
      gender: `mens`,
      sport: `mens-basketball`,
      path: __dirname
    })
  })
})