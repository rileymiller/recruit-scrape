
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Harvard Football`, () => {
  it(`Fetches Harvard Football Coaches`, () => {
    ScrapeCoaches({
      url: `https://gocrimson.com/sports/football/coaches`,
      division: `d1`,
      conference: `Ivy League`,
      school: `Harvard`,
      gender: `Mens`,
      sport: `Football`,
      path: __dirname
    })
  })
})