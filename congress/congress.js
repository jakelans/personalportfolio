import { senators } from '../data/senators.js'
import { representatives } from '../data/representatives.js'
import { removeChildren } from '../utils/index.js'

const members = [...senators, ...representatives] // modern way to combine arrays like a genus!

const senatorDiv = document.querySelector('.senators')
const loyaltyHeading = document.querySelector('.mostLoyal')
const seniorityHeading = document.querySelector('.seniority')

function SimplifiedMembers(chamberFilter) {
  const filteredArray = members.filter((member) => 
    chamberFilter ? member.short_title === chamberFilter : member,
    // chamberFilter ? member.party === chamberFilter : member,
  )

  return filteredArray.map((senator) => {
    let middleName = senator.middle_name ? ` ${senator.middle_name} ` : ` `
    return {
      id: senator.id,
      name: `${senator.first_name}${middleName}${senator.last_name}`,
      party: senator.party,
      gender: senator.gender,
      seniority: +senator.seniority,
      imgURL: `https://www.govtrack.us/static/legislator-photos/${senator.govtrack_id}-100px.jpeg`,
      missedVotesPct: senator.missed_votes_pct,
      loyaltyPct: senator.votes_with_party_pct,
    }
  })
}

function populateSenatorDiv(simpleSenators) {
  removeChildren(main)
  
  simpleSenators.forEach((senator) => {
    const senFigure = document.createElement('figure')
    const figImg = document.createElement('img')
    const figCaption = document.createElement('figcaption')

    figImg.src = senator.imgURL
    figCaption.textContent = senator.name

    senFigure.appendChild(figImg)
    senFigure.appendChild(figCaption)
    senatorDiv.appendChild(senFigure)

    main.appendChild(senFigure)
  })
}

const filterSenators = (prop, value) => SimplifiedMembers().filter(senator => senator[prop] === value)

//console.log(filterSenators('gender', 'F'))

const mostSeniorMember = SimplifiedMembers().reduce((acc, senator) =>
  acc.seniority > senator.seniority ? acc : senator,
)

seniorityHeading.textContent = `The most senior member of Congress is ${mostSeniorMember.name} who has been in congress for ${mostSeniorMember.seniority} years.`

const mostLoyal = SimplifiedMembers().reduce((acc, senator) => {
  if (senator.loyaltyPct === 100) {
    acc.push(senator)
  }
  return acc
}, [])

const cowardList = document.createElement('ol')

const spineless = mostLoyal.map((coward) => {
  let listItem = document.createElement('li')
  listItem.textContent = coward.name
  cowardList.appendChild(listItem)
})

loyaltyHeading.appendChild(cowardList)

//populateSenatorDiv(SimplifiedMembers())


const senButton = document.querySelector('.senbutton')
senButton.addEventListener('click', () => populateSenatorDiv(SimplifiedMembers('Sen.')))

const repButton = document.querySelector('.repbutton')
repButton.addEventListener('click', () => populateSenatorDiv(SimplifiedMembers('Rep.')))

const conButton = document.querySelector('.conbutton')
conButton.addEventListener('click', () => populateSenatorDiv(filterSenators('party', 'R')))

const libButton = document.querySelector('.libbutton')
libButton.addEventListener('click', () => populateSenatorDiv(filterSenators('party', 'D')))