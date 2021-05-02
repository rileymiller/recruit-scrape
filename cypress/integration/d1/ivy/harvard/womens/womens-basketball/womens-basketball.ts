
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Harvard Women's Basketball`, () => {
  it(`Fetches Harvard WBB Coaches`, () => {
    ScrapeCoaches({
      url: `https://gocrimson.com/sports/womens-basketball/coaches`,
      division: `d1`,
      conference: `Ivy League`,
      school: `Harvard`,
      gender: `Womens`,
      sport: `Womens Basketball`,
      path: __dirname
    })
  })
})