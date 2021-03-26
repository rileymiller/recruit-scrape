
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`PLU Football`, () => {
  it(`Fetches PLU Football Coaches`, () => {
    ScrapeCoaches({
      url: `https://golutes.com/sports/football/coaches`,
      division: `d3`,
      conference: `northwest-conference`,
      school: `plu`,
      gender: `mens`,
      sport: `football`,
      path: __dirname
    })
  })
})