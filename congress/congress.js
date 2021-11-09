import { senators  } from '../data/senators.js'

const sentaorDiv = document.querySelector('.senators')

function SimplifiedSenators(senatorArray) {
    return senatorArray.map(senator => {
        let middleName = senator.middle_name ? `${senator.middle_name}`: ``
        return {
            id: senator.id,
            name: `${senator.first_name} ${middleNName} ${senator.last_name}`,
            party: senator.party
        }
    })
}

