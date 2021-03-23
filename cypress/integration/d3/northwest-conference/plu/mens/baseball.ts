
import { ScrapeCoaches } from '../../../../../support/index'
describe(`PLU Baseball`, () => {
  it(`Fetches PLU Baseball Coaches`, () => {
    ScrapeCoaches(`https://golutes.com/sports/baseball/coaches`, `plu`, `baseball`)
  })
})