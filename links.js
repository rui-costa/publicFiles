let pass_visible = false;
let id = 1;
let main_url = 'https://obs.ninja/?'
let room_code = ''
let room_password = ''

function tooglePassword() {
    let password = document.getElementById('room_password')
    if (pass_visible) {
        password.setAttribute("type", "password")
        document.getElementById('showPass').setAttribute("class", "btn btn-outline-success")
        pass_visible = false
    } else {
        password.setAttribute("type", "text")
        document.getElementById('showPass').setAttribute("class", "btn btn-danger")
        pass_visible = true
    }
}

function validInputs() {
    if (document.getElementById('room_code').value === "" || document.getElementById('room_password').value === "") {
        return false
    } else {
        return true
    }

}

function addTemplate() {
    if (validInputs()) {
        room_code = document.getElementById('room_code').value
        room_password = document.getElementById('room_password').value

        let template = document.getElementById('template')
        let content = document.getElementById('content')
        let new_div = template.cloneNode("true")
        new_div.setAttribute("id", id)
        new_div.setAttribute("class", "row")

        
        if(document.title == 'Producer Mode'){
            
            new_div.querySelector('#camera_t1').setAttribute('id', 'camera_' + id)
            new_div.querySelector('#desktop_t1').setAttribute('id', 'desktop_' + id)
            new_div.querySelector('#camera_' + id).setAttribute('src', generateLink('camera', 'view', id))
            new_div.querySelector('#desktop_' + id).setAttribute('src', generateLink('screen', 'view', id))
            ++id

            new_div.querySelector('#camera_t2').setAttribute('id', 'camera_' + id)
            new_div.querySelector('#desktop_t2').setAttribute('id', 'desktop_' + id)
            new_div.querySelector('#camera_' + id).setAttribute('src', generateLink('camera', 'view', id))
            new_div.querySelector('#desktop_' + id).setAttribute('src', generateLink('screen', 'view', id))
            ++id

            new_div.querySelector('#camera_t3').setAttribute('id', 'camera_' + id)
            new_div.querySelector('#desktop_t3').setAttribute('id', 'desktop_' + id)
            new_div.querySelector('#camera_' + id).setAttribute('src', generateLink('camera', 'view', id))
            new_div.querySelector('#desktop_' + id).setAttribute('src', generateLink('screen', 'view', id))
            ++id
        
        }
        
        if(document.title == 'Invitation Mode'){

            new_div.querySelector('#camera_share_button_').setAttribute('id','camera_share_button_' + id)
            new_div.querySelector('#camera_share_button_' + id).setAttribute("onclick",`generateToClipboard('camera','share',${id})`) 

            new_div.querySelector('#camera_view_button_').setAttribute('id','camera_view_button_' + id)
            new_div.querySelector('#camera_view_button_' + id).setAttribute("onclick",`generateToClipboard('camera','view',${id})`) 

            new_div.querySelector('#desktop_share_button_').setAttribute('id','desktop_share_button_' + id)
            new_div.querySelector('#desktop_share_button_' + id).setAttribute("onclick",`generateToClipboard('screen','share',${id})`) 

            new_div.querySelector('#desktop_view_button_').setAttribute('id','desktop_view_button_' + id)
            new_div.querySelector('#desktop_view_button_' + id).setAttribute("onclick",`generateToClipboard('screen','view',${id})`) 
            
            ++id
            content.appendChild(new_div)
            
        }

        content.appendChild(new_div)
    } else {
        alert("Add Room Code and Password")
    }
}

function generateToClipboard(link_type, operation, iterator) {
    copyToClipboard(generateLink(link_type, operation, iterator))
}

function copyRoomCode(){
    copyToClipboard(document.getElementById('room_code').value)
}

function copyRoomPassword(){
    copyToClipboard(document.getElementById('room_password').value)
}

function copyToClipboard(text){
    let clipboard = document.getElementById('clipboard')
    clipboard.value = text
    clipboard.select()
    clipboard.setSelectionRange(0, 99999)
    document.execCommand("copy")    
}

function generateCameraViewLink(code, pass, iterator) {
    let pw = 'pw'
    let operation = 'view'
    return `https://obs.ninja/?${operation}=${code}_C${iterator}&${pw}=${pass}`
}

function generateCameraShareLink(code, pass, iterator) {
    let pw = 'password'
    let operation = 'push'
    return `https://obs.ninja/?${operation}=${code}_C${iterator}&${pw}=${pass}&webcam`
}

function generateScreenViewLink(code, pass, iterator) {
    let pw = 'pw'
    let operation = 'view'
    return `https://obs.ninja/?${operation}=${code}_D${iterator}&${pw}=${pass}`
}

function generateScreenShareLink(code, pass, iterator) {
    let pw = 'password'
    let operation = 'push'
    return `https://obs.ninja/?${operation}=${code}_D${iterator}&${pw}=${pass}&screenshare`
}

function generateLink(link_type, operation, iterator) {
    switch (`${link_type}_${operation}`) {
        case 'camera_view':
            return generateCameraViewLink(room_code, room_password, iterator)
            break;
        case 'camera_share':
            return generateCameraShareLink(room_code, room_password, iterator)
            break;
        case 'screen_view':
            return generateScreenViewLink(room_code, room_password, iterator)
            break;
        case 'screen_share':
            return generateScreenShareLink(room_code, room_password, iterator)
            break;
        default:
            console.log('SOMETHING FAILED WHEN GENERATING LINK')
    }
}

function startStream() {
    room_code = prompt("Insert your Room Code\n", 'Use the same code you generated before');
    room_password = prompt("Insert your Password\n", 'Use the same password you generated before');
}

function changePresenter(iterator) {
    document.getElementById('camera').setAttribute('src', generateLink('camera', 'view', iterator))
    document.getElementById('desktop').setAttribute('src', generateLink('screen', 'view', iterator))
}

// ADD LISTENERS
if (document.getElementById('add') != null) {
    document.getElementById('add').addEventListener("click", function () {
        addTemplate()
    })
}

if (document.getElementById('showPass') != null) {
    document.getElementById('showPass').addEventListener("click", function () {
        tooglePassword()
    })
}

if (document.getElementById('cp_room_code') != null){
    document.getElementById('cp_room_code').addEventListener("click", function () {
        copyRoomCode()
    })
}

if (document.getElementById('cp_room_password') != null){
    document.getElementById('cp_room_password').addEventListener("click", function () {
        copyRoomCode()
    })
}

if (document.title == "Sharing Mode") {
    startStream()
    changePresenter(1)
    window.addEventListener('keypress', function (e) {
        if (!isNaN(e.key)) {
            changePresenter(e.key)
            console.log(`Changing to Presenter ${e.key}`)
        }
    }
    )
}
