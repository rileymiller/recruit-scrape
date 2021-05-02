
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`USC Upstate Baseball`, () => {
  it(`Fetches USC Upstate Baseball Coaches`, () => {
    ScrapeCoaches({
      url: `https://upstatespartans.com/sports/baseball/coaches`,
      division: `d1`,
      conference: `Big South`,
      school: `USC-Upstate`,
      gender: `Mens`,
      sport: `Baseball`,
      path: __dirname
    })
  })
})