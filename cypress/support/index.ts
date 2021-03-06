
type Divisions = 'd1' | 'd2' | 'd3' | 'juco' | 'naia'

type Conferences = 'RMAC'
  | 'Big South'
  | 'Ivy League'
  | 'Pac-12'
  | 'Northwest Conference'

type Schools = 'Colorado School of Mines'
  | 'Colorado State University-Pueblo (CSUP)'
  | 'Pacific Lutheran University (PLU)'
  | 'USC-Upstate'
  | 'Harvard'
  | 'University of Southern California (USC)'

type Gender = 'Mens' | 'Womens'

type Sports = 'Football'
  | 'Baseball'
  | 'Mens Basketball'
  | 'Womens Basketball'
  | 'Softball'
  | 'Mens Golf'
  | 'Womens Golf'
  | 'Cross Country'

type ScrapeConfig = {
  url: string
  division: Divisions
  conference: Conferences
  school: Schools
  gender: Gender
  sport: Sports
  path: string
}

export const MAX_COACHES = 15


const hideGoogleElements = () => {
  // Remove obfuscating google ads
  cy.get('body')
    .then(($body) => {
      $body.find(`#google_image_div`).css('display', 'none')
      $body.find(`.GoogleActiveViewElement`).css('display', 'none')
      $body.find(`.img_ad`).css('display', 'none')
    })
}

const hideCoachBioPageObfuscatingElements = ($body: JQuery<HTMLBodyElement>) => {
  // Remove some obfuscating elements
  $body.find('nav').remove()
  $body.find('.main-header').remove()
  $body.find('.sidearm-alerts').remove()
  $body.find('#sidearm-alerts').remove()
  $body.find(`#google_image_div`).remove()
  $body.find('alerts-component').remove()
}
/**
 * Function to scrape a sidearm sports coaches page
 * 
 * @param url 
 * @param school 
 * @param sport 
 */
export const ScrapeCoaches = (config: ScrapeConfig) => {
  const { url, division, conference, school, gender, sport, path } = config

  cy.log(`Path: ${path}`)
  // go to the scraping url
  cy.visit(url)

  let coaches = []

  // fetch all of the coach rows
  cy.get(`.sidearm-coaches-coach`).then(el => {
    cy.log(`Coaches found: ${JSON.stringify(el.length)}`)

    hideGoogleElements()

    if (!el.length) throw Error('Could not find number of coaches')

    const numCoaches = (el.length < MAX_COACHES) ? el.length : MAX_COACHES

    cy.log(`Collecting ${numCoaches} coaches`)

    // Loop through all of the coaches
    for (let i = 0; i < numCoaches; i++) {
      let coachDTO = {
        metadata: {},
        bioImage: {}
      }

      cy.get('.sidearm-coaches-coach').eq(i).then(el => {
        const coachLink = el.find('th > a')

        // navigate to the coaches bio
        cy.wrap(coachLink).should(`be.visible`).click({ force: true })

        cy.get(`.sidearm-coach-bio-name`).should(`be.visible`).then(el => {
          const coachName = el.text().trim().replace(/\s\s+/g, " ")
          expect(coachName).not.to.be.undefined

          coachDTO = {
            ...coachDTO,
            metadata: {
              ...coachDTO.metadata,
              coachName
            }
          }

          cy.log(`Coach Name: ${coachName}`)

          if (Cypress.env('write_images')) {
            // Take a screenshot of the coaches bio picture
            cy.get('body')
              .then(($body) => {

                // synchronously query from body
                // to check if the coach has an image
                if ($body.find('.sidearm-coach-bio-image > img').length) {
                  // cy.wait(1000)


                  // Remove whitespace from the coach's name for the image file path
                  const formattedCoachName = coachName.replace(/\s/g, "")
                  const imagePath = `images/${formattedCoachName}`

                  const screenshotPath = `${division}/${conference}/${school}/${gender}/${sport}/${formattedCoachName}`

                  hideCoachBioPageObfuscatingElements($body)

                  // Take a screenshot of the coach's headshot
                  cy.get(`.sidearm-coach-bio-image > img`).should(`be.visible`).screenshot(screenshotPath, { scale: false })

                  // grab the path to the coach's screenshot
                  coachDTO = {
                    ...coachDTO,
                    bioImage: {
                      imagePath: `${imagePath}.png`
                    }
                  }
                } else {
                  cy.log(`No image for coach: ${coachName}`)
                }
              })
          } else {
            cy.log(`write_images set to false, skipping grabbing images`)
          }
        })

        // scrape the coaches bio information
        cy.get(`.sidearm-coach-bio-fields`).should(`be.visible`).within(() => {

          // loop through all of the bio fields
          cy.get('dl').each(el => {
            cy.wrap(el).within(() => {
              let label = ''

              // get the bio label
              cy.get('dt').then(el => {
                cy.log(el.text())
                label = el.text()

              })

              // get the bio value
              cy.get('dd').then(el => {
                cy.log(el.text())

                const value = el.text().trim()

                coachDTO = {
                  ...coachDTO,
                  metadata: {
                    ...coachDTO.metadata,
                    [label]: value
                  }
                }
              })
            })
          })
        }).then(_ => {
          cy.log(JSON.stringify(coachDTO))
          coaches = [
            ...coaches,
            coachDTO
          ]
        })

        cy.go('back')
        cy.get(`.sidearm-coaches-coach`).should(`be.visible`)
      })
    }
  }).then(_ => {
    cy.log(JSON.stringify(coaches))

    const scrapeResult = {
      division,
      conference,
      school,
      gender,
      sport,
      coaches
    }

    cy.writeFile(`build/${division}/${conference}/${school}/${gender}/${sport}/coaches.json`, scrapeResult)

    // if (Cypress.env('update_snapshots')) {
    //   const reducedCoaches = coaches.map(coach => {
    //     delete coach.imagePath
    //     return coach
    //   })
    //   cy.writeFile(`${path}/snapshot.json`, reducedCoaches)
    // } else {
    //   cy.log(`update_snapshots set to false, skipping snapshot update`)
    // }

    // // Assert that the coaches object has not changed
    // cy.readFile(`${path}/snapshot.json`).then(snapshot => {
    //   const reducedCoaches = coaches.map(coach => {
    //     delete coach.imagePath
    //     return coach
    //   })
    //   expect(reducedCoaches).to.deep.equal(snapshot)
    // })


  })
}