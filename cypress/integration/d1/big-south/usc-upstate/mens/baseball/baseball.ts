
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`USC Upstate Baseball`, () => {
  it(`Fetches USC Upstate Baseball Coaches`, () => {
    ScrapeCoaches({
      url: `https://upstatespartans.com/sports/baseball/coaches`,
      division: `d1`,
      conference: `big-south`,
      school: `usc-upstate`,
      gender: `mens`,
      sport: `baseball`,
      path: __dirname
    })
  })
})