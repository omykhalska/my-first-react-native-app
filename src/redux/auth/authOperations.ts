import {authSlice} from './authReducer'
import {
    createNewUser,
    logInUser,
    logOutUser,
    updateAvatar,
    auth,
} from '../../firebase'
import {handleAuthErrors} from '../../helpers/handleAuthErrors'
import {onAuthStateChanged} from 'firebase/auth'
import {IUser} from '../../interfaces'

interface INewUser {
    login: string
    email: string
    password: string
    avatar: string
}

export const authRegisterUser = ({
                                     login,
                                     email,
                                     password,
                                     avatar,
                                 }: INewUser) => async (dispatch: (arg0: { payload: IUser; type: "auth/updateUserProfile" }) => void, _: any) => {
    try {
        const user = await createNewUser(login, email, password, avatar)

        dispatch(authSlice.actions.updateUserProfile(<IUser>user))
    } catch (error) {
        handleAuthErrors(error)
    }
}


export const authLogInUser = (email: string, password: string) => async () => {
    try {
        await logInUser(email, password)
    } catch (error) {
        handleAuthErrors(error)
    }
}

export const authLogOutUser = () => async (dispatch: (arg0: { payload: { stateChange: boolean }; type: "auth/signOutUser" }) => void) => {
    try {
        await logOutUser()

        dispatch(authSlice.actions.signOutUser({stateChange: false}))
    } catch (error) {
        handleAuthErrors(error)
    }
}

export const authStateChangeUser = () => async (dispatch: (arg0: { payload: IUser | { stateChange: boolean }; type: "auth/updateUserProfile" | "auth/authStateChange" }) => void) => {
    await onAuthStateChanged(auth, (user) => {
        if (user) {
            const update = {
                userId: user.uid,
                userName: user.displayName,
                userEmail: user.email,
                userAvatar: user.photoURL,
            }

            dispatch(authSlice.actions.updateUserProfile(<IUser>update))
            dispatch(authSlice.actions.authStateChange({stateChange: true}))
        } else {
            dispatch(authSlice.actions.authStateChange({stateChange: false}))
        }
    })
}

export const authUpdateUserPhoto = (avatar: string) => {
    return async (dispatch: (arg0: { payload: IUser; type: "auth/updateUserProfile" }) => void, _: any) => {
        try {
            const updatedUser = await updateAvatar(avatar)

            dispatch(authSlice.actions.updateUserProfile(<IUser>updatedUser))
        } catch (error) {
            handleAuthErrors(error)
        }
    }
}
