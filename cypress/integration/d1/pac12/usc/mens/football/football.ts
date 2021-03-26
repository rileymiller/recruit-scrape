
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`USC Football`, () => {
  it(`Fetches USC Football Coaches`, () => {
    ScrapeCoaches({
      url: `https://usctrojans.com/sports/football/coaches`,
      division: `d1`,
      conference: `pac12`,
      school: `usc`,
      gender: `mens`,
      sport: `football`,
      path: __dirname
    })
  })
})