
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
  // cy.viewport(1280, 800)
  cy.get(`.sidearm-coaches-coach`).then(el => {
    cy.log(`Coaches found: ${JSON.stringify(el.length)}`)

    cy.get('body')
      .then(($body) => {
        $body.find(`#google_image_div`).css('display', 'none')
        $body.find(`.GoogleActiveViewElement`).css('display', 'none')
        $body.find(`.img_ad`).css('display', 'none')
      })
    // Loop through all of the coaches
    for (let i = 0; i < el.length; i++) {
      cy.get('.sidearm-coaches-coach').eq(i).then(el => {
        const coachLink = el.find('th > a')

        cy.wrap(coachLink).should(`be.visible`).click({ force: true })

        cy.get(`.sidearm-coach-bio-name`).should(`be.visible`).then(el => {
          const coachName = el.text().replace(/\s/g, "")
          expect(coachName).not.to.be.undefined

          cy.log(`Coach Name: ${coachName}`)
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

                // image was found, take a screenshot
                cy.get(`.sidearm-coach-bio-image > img`).should(`be.visible`).screenshot(`${school}/${sport}/${coachName}`, { scale: false })
              } else {
                cy.log(`No image for coach: ${coachName}`)
              }
            })
        })

        // Grab the coaches bio information

        cy.get(`.sidearm-coach-bio-fields`).should(`be.visible`).within(() => {
          // get the bio field
          cy.get('dl').each(el => {
            cy.wrap(el).within(() => {

              // get the bio label
              cy.get('dt').then(el => {
                cy.log(el.text())
              })

              // get the bio value
              cy.get('dd').then(el => {
                cy.log(el.text())
              })
            })
          })
        })

        cy.go('back')
        cy.get(`.sidearm-coaches-coach`).should(`be.visible`)

      })
    }
  })
}