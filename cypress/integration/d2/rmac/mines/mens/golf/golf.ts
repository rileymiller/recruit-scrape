
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado School of Mines`, () => {
  it(`Fetches Mines Golf Coaches`, () => {
    ScrapeCoaches({
      url: `https://minesathletics.com/sports/mens-golf/coaches`,
      division: `d2`,
      conference: `rmac`,
      school: `mines`,
      gender: `mens`,
      sport: `mens-golf`,
      path: __dirname
    })
  })
})
