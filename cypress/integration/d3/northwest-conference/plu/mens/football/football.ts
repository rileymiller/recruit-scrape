
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`PLU Football`, () => {
  it(`Fetches PLU Football Coaches`, () => {
    ScrapeCoaches({
      url: `https://golutes.com/sports/football/coaches`,
      division: `d3`,
      conference: `Northwest Conference`,
      school: `Pacific Lutheran University (PLU)`,
      gender: `Mens`,
      sport: `Football`,
      path: __dirname
    })
  })
})