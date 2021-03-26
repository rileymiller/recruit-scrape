
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Harvard Women's Basketball`, () => {
  it(`Fetches Harvard WBB Coaches`, () => {
    ScrapeCoaches({
      url: `https://gocrimson.com/sports/womens-basketball/coaches`,
      division: `d1`,
      conference: `ivy`,
      school: `harvard`,
      gender: `womens`,
      sport: `womens-basketball`,
      path: __dirname
    })
  })
})