
import { ScrapeCoaches } from '../../../../../support/index'
describe(`Harvard Women's Basketball`, () => {
  it(`Fetches Harvard WBB Coaches`, () => {
    ScrapeCoaches(`https://gocrimson.com/sports/womens-basketball/coaches`, `harvard`, `womens-basketball`)
  })
})