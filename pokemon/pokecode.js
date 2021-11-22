async function getAPIData(url) {
    try{
        const response = await fetch(url)
        const data = await response.json()
        return data
    } catch (error) {
        console.error(error)
    }
}

getAPIData(`https://pokeapi.co/api/v2/pokemon/25`)
.then((data) => {
    console.log(data)
    populatePokeCards(data)
})

function populatePokeCards(sinlepokemon){
    const pokeScene = document.createElement('div')
    const pokeCard = document.createElement('div')
    const pokeFront = document.createElement('div')
    const pokeBack = document.createElement('div')
    
    pokeCard.appendChild(pokeFront)
    pokeCard.appendChild(pokeBack)
    pokeScene.appendChild(pokeCard)
    
}