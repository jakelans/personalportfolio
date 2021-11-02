import { starships } from "../data/starships.js";
import { getLastNumber } from "../utils/index.js"

const nav = document.querySelector('.nav')
const navList = document.querySelector('.navList')
const shipView = document.querySelector('.displaySection')

function populateNav(starships) {
  starships.forEach(starship => {
    let anchorWrap = document.createElement('a')
    anchorWrap.href = '#'
    let listItem  = document.createElement('li')
    listItem.textContent = starship.name
    anchorWrap.addEventListener('click', () => {
      populateShipView(starship)
    })

    anchorWrap.appendChild(listItem)
    navList.appendChild(anchorWrap)
  })
}

populateNav(starships)

function populateShipView(shipData) {
  console.log(`Thanks for clicking on ${shipData.name}`)
  let shipImage = document.createElement('img')
  let shipNum = getLastNumber(shipData.url)
  shipImage.src = `https:starwars-visualguide.com/assets/img/starships/${shipNum}.jpg`
  shipView.appendChild(shipImage)
}