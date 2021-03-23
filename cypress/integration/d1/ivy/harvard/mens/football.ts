
import { ScrapeCoaches } from '../../../../../support/index'
describe(`Harvard Football`, () => {
  it(`Fetches Harvard Football Coaches`, () => {
    ScrapeCoaches(`https://gocrimson.com/sports/football/coaches`, `harvard`, `football`)
  })
})