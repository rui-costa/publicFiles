function getRandomText(){
    return btoa(Math.floor(Math.random()*100000000000)+ 10000000000000000000000).replaceAll('=','').substring(1,20)
}

var TEAM_UNIQUE_LINK = prompt("Insert your Room Code\nCannot be longer than 20 chars\nYou can also use the auto-generated one", (getRandomText())); 
const PASSWORD = prompt("Insert your Password\nYou can also use the auto-generated one", (getRandomText()));


function obsUrl(readWrite,object,iterator = 1){
    let type = 'error_in_parameter'
    let data_object = 'error_in_object'
    let pw = 'error_in_parameter'
    if (readWrite === 'r'){
        type = 'view'
        pw = 'pw'
    }

    if (readWrite === 'w'){
        type = 'push'
        pw = 'password'
    }

    if(object === 'camera'){
        data_object = `_C${iterator}`
    }
    if(object === 'desktop'){
        data_object = `_D${iterator}`
    }

    return `https://obs.ninja/?${type}=${TEAM_UNIQUE_LINK}${data_object}&${pw}=${PASSWORD}`

}

function mainShare(){
    document.getElementById('camera').src = obsUrl('r','camera')
    document.getElementById('desktop').src = obsUrl('r','desktop')
}

function mainInvite(){
    document.getElementById('camera').href = obsUrl('w','camera')
    document.getElementById('desktop').src = obsUrl('w','desktop')
}
