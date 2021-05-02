
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado School of Mines`, () => {
  it(`Fetches Mines Football Coaches`, () => {
    ScrapeCoaches({
      url: `https://minesathletics.com/sports/football/coaches`,
      division: `d2`,
      conference: `RMAC`,
      school: `Colorado School of Mines`,
      gender: `Mens`,
      sport: `Football`,
      path: __dirname
    })
  })
})