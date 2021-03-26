
/**
 * Function to scrape a sidearm sports coaches page
 * 
 * @param url 
 * @param school 
 * @param sport 
 */
export const ScrapeCoaches = (url: string, school: string, sport: string) => {
  // go to the scraping url
  cy.visit(url)

  let coaches = []

  // fetch all of the coach rows
  cy.get(`.sidearm-coaches-coach`).then(el => {
    cy.log(`Coaches found: ${JSON.stringify(el.length)}`)

    // Remove obfuscating google ads
    cy.get('body')
      .then(($body) => {
        $body.find(`#google_image_div`).css('display', 'none')
        $body.find(`.GoogleActiveViewElement`).css('display', 'none')
        $body.find(`.img_ad`).css('display', 'none')
      })

    // Loop through all of the coaches
    for (let i = 0; i < el.length; i++) {
      let coachDTO = {}

      cy.get('.sidearm-coaches-coach').eq(i).then(el => {
        const coachLink = el.find('th > a')

        // navigate to the coaches bio
        cy.wrap(coachLink).should(`be.visible`).click({ force: true })

        cy.get(`.sidearm-coach-bio-name`).should(`be.visible`).then(el => {
          const coachName = el.text().trim().replace(/\s\s+/g, " ")
          expect(coachName).not.to.be.undefined

          coachDTO = {
            ...coachDTO,
            coachName,
          }

          cy.log(`Coach Name: ${coachName}`)

          // Take a screenshot of the coaches bio picture
          cy.get('body')
            .then(($body) => {

              // synchronously query from body
              // to check if the coach has an image
              if ($body.find('.sidearm-coach-bio-image > img').length) {

                // Remove some obfuscating elements
                $body.find('nav').css('display', 'none')
                $body.find('.main-header').css('display', 'none')
                $body.find('.sidearm-alerts').css('display', 'none')
                $body.find(`#google_image_div`).css('display', 'none')

                // Remove whitespace from the coach's name for the image file path
                const formattedCoachName = coachName.replace(/\s/g, "")
                const imagePath = `images/${formattedCoachName}`

                // image was found, take a screenshot
                cy.get(`.sidearm-coach-bio-image > img`).should(`be.visible`).screenshot(`${school}/${sport}/${formattedCoachName}`, { scale: false })

                coachDTO = {
                  ...coachDTO,
                  imagePath: `${imagePath}.png`
                }
              } else {
                cy.log(`No image for coach: ${coachName}`)
              }
            })
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
                  [label]: value
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
    cy.writeFile(`build/${school}/${sport}/coaches.json`, coaches)
  })
}