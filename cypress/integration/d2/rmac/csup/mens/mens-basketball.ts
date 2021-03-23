
import { ScrapeCoaches } from '../../../../../support/index'
describe(`Colorado State-Pueblo Men's Basketball`, () => {
  it(`Fetches Colorado State-Pueblo Men's Basketball Coaches`, () => {
    ScrapeCoaches(`https://gothunderwolves.com/sports/mens-basketball/coaches`, `csup`, `mens-basketball`)
  })
})