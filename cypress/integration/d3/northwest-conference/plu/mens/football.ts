
import { ScrapeCoaches } from '../../../../../support/index'
describe(`PLU Football`, () => {
  it(`Fetches PLU Football Coaches`, () => {
    ScrapeCoaches(`https://golutes.com/sports/football/coaches`, `plu`, `football`)
  })
})