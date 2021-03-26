
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Harvard Football`, () => {
  it(`Fetches Harvard Football Coaches`, () => {
    ScrapeCoaches({
      url: `https://gocrimson.com/sports/football/coaches`,
      division: `d1`,
      conference: `ivy`,
      school: `harvard`,
      gender: `mens`,
      sport: `football`,
      path: __dirname
    })
  })
})