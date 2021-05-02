
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`USC Football`, () => {
  it(`Fetches USC Football Coaches`, () => {
    ScrapeCoaches({
      url: `https://usctrojans.com/sports/football/coaches`,
      division: `d1`,
      conference: `Pac-12`,
      school: `University of Southern California (USC)`,
      gender: `Mens`,
      sport: `Football`,
      path: __dirname
    })
  })
})