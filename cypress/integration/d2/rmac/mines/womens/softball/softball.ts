
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado School of Mines`, () => {
  it(`Fetches Mines Softball Coaches`, () => {
    ScrapeCoaches({
      url: `https://minesathletics.com/sports/softball/coaches`,
      division: `d2`,
      conference: `RMAC`,
      school: `Colorado School of Mines`,
      gender: `Womens`,
      sport: `Softball`,
      path: __dirname
    })
  })
})