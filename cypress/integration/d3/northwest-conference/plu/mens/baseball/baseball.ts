
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`PLU Baseball`, () => {
  it(`Fetches PLU Baseball Coaches`, () => {
    ScrapeCoaches({
      url: `https://golutes.com/sports/baseball/coaches`,
      division: `d3`,
      conference: `Northwest Conference`,
      school: `Pacific Lutheran University (PLU)`,
      gender: `Mens`,
      sport: `Baseball`,
      path: __dirname
    })
  })
})