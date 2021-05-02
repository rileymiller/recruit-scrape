
import { ScrapeCoaches } from '../../../../../../support/index'
describe(`Colorado School of Mines`, () => {
  it(`Fetches Mines Golf Coaches`, () => {
    ScrapeCoaches({
      url: `https://minesathletics.com/sports/mens-golf/coaches`,
      division: `d2`,
      conference: `RMAC`,
      school: `Colorado School of Mines`,
      gender: `Mens`,
      sport: `Mens Golf`,
      path: __dirname
    })
  })
})
