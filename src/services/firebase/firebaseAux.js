import {auth} from "./firabaseConfig";

const userLogged = {
    name: '',
    email: '',
    photoUrl: '',
    uuid: '',
    isTeacher: false
}
export function getCurrentUser(){
    const user = auth.currentUser
    if(user !== null) {
        userLogged.email = user.email
        userLogged.photoUrl = user.photoURL
        return userLogged
    }
    return null;
}

export function persistUuid(uuid){
    userLogged.uuid = uuid
}

export function persistName(name){
    userLogged.name = name
}

export function persistIsTeacher(isTeacher){
    userLogged.isTeacher = isTeacher
}