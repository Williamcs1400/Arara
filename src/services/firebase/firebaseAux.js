import {auth} from "./firabaseConfig";

const userLogged = {
    name: '',
    email: '',
    photoUrl: '',
}
export function getCurrentUser(){
    const user = auth.currentUser
    if(user !== null) {
        userLogged.name = user.displayName
        userLogged.email = user.email
        userLogged.photoUrl = user.photoURL
        return userLogged
    }
    return null;
}