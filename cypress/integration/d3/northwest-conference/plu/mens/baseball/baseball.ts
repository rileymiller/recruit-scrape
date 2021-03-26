
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`PLU Baseball`, () => {
  it(`Fetches PLU Baseball Coaches`, () => {
    ScrapeCoaches({
      url: `https://golutes.com/sports/baseball/coaches`,
      division: `d3`,
      conference: `northwest-conference`,
      school: `plu`,
      gender: `mens`,
      sport: `baseball`,
      path: __dirname
    })
  })
})