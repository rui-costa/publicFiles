var TEAM_UNIQUE_LINK = prompt("Please add your unique team link\nCannot be longer than 20 chars", (((1+Math.random())*0x10000)|0).toString(20).substring(1)); //cannot be 20 chars
const PASSWORD = prompt("Add a password for added protection", (((1+Math.random())*0x10000)|0).toString(16).substring(1));


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
