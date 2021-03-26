
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado School of Mines`, () => {
  it(`Fetches Mines Softball Coaches`, () => {
    ScrapeCoaches({
      url: `https://minesathletics.com/sports/softball/coaches`,
      division: `d2`,
      conference: `rmac`,
      school: `mines`,
      gender: `womens`,
      sport: `softball`,
      path: __dirname
    })
  })
})