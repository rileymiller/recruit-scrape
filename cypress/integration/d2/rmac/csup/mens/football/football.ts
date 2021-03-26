
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado State-Pueblo Football`, () => {
  it(`Fetches Colorado State-Pueblo Football Coaches`, () => {
    ScrapeCoaches({
      url: `https://gothunderwolves.com/sports/football/coaches`,
      division: `d2`,
      conference: `rmac`,
      school: `csup`,
      gender: `mens`,
      sport: `football`,
      path: __dirname
    })
  })
})