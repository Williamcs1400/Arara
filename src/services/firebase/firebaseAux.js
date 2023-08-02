import {auth} from "./firabaseConfig";

const userLogged = {
    name: '',
    email: '',
    photoUrl: '',
    uuid: ''
}
export function getCurrentUser(){
    const user = auth.currentUser
    if(user !== null) {
        userLogged.name = user.displayName
        userLogged.email = user.email
        userLogged.photoUrl = user.photoURL
        userLogged.uuid = user.uid
        return userLogged
    }
    return null;
}