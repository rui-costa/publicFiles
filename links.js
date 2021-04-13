function getRandomText(){
    return btoa(Math.floor(Math.random()*100000000000)+ 10000000000000000000000).replaceAll('=','').substring(1,20)
}

const ROOM_CODE = prompt("Insert your Room Code\nCannot be longer than 20 chars\nYou can also use the auto-generated one", (getRandomText())); 
const PASSWORD = prompt("Insert your Password\nYou can also use the auto-generated one", (getRandomText()));

function showCredentials(){
    prompt("Here is your ROOM CODE", (ROOM_CODE)); 
    prompt("HERE is your PASSWORD", (PASSWORD));
}

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
        data_object = `_C${iterator}&webcam`
    }
    if(object === 'desktop'){
        data_object = `_D${iterator}&screenshare`
    }

    return `https://obs.ninja/?${type}=${ROOM_CODE}${data_object}&${pw}=${PASSWORD}`

}

function mainShare(){
    document.getElementById('camera').src = obsUrl('r','camera')
    document.getElementById('desktop').src = obsUrl('r','desktop')
}

function mainInvite(){
    document.getElementById('camera').href = obsUrl('w','camera')
    document.getElementById('desktop').src = obsUrl('w','desktop')
}
