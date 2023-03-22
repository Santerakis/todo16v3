import {Dispatch} from 'redux'
import {SetAppErrorActionType, setAppStatusAC, SetAppStatusActionType} from '../../app/app-reducer'
import {authAPI, Result_Code} from "../../api/todolists-api";
import {FormDataType} from "./Login";
import {handleServerAppError, handleServerNetworkError} from "../../utils/error-utils";

const initialState = {
    isInitialized: false,
    isLoggedIn: false
}
type InitialStateType = typeof initialState

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
    switch (action.type) {
        case 'login/SET-IS-LOGGED-IN':
            return {...state, isLoggedIn: action.value}
        case 'login/SET-IS-INITIALIZED':
            return {...state, isInitialized: action.value}
        default:
            return state
    }
}
// actions
export const setIsLoggedInAC = (value: boolean) =>
    ({type: 'login/SET-IS-LOGGED-IN', value} as const)
export const setIsInitializedAC = (value: boolean) =>
    ({type: 'login/SET-IS-INITIALIZED', value} as const)

// thunks
export const loginTC = (data: FormDataType) => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.login(data)
        if (res.resultCode === Result_Code.Ok) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            console.log('else res: ', res)
            handleServerAppError(res, dispatch)
        }
    } catch (e: any) {               // try не знает что был асинх запрос и сюда свалится ошибка аксиусаю Нужно делать типизацию
        handleServerNetworkError(e, dispatch)
    }
}

export const meTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.me()
        if (res.resultCode === Result_Code.Ok) {
            dispatch(setIsLoggedInAC(true))
            dispatch(setIsInitializedAC(true))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            // console.log('else res: ', res)
            dispatch(setIsInitializedAC(true))
            handleServerAppError(res, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

export const logOutTC = () => async (dispatch: Dispatch<ActionsType>) => {
    dispatch(setAppStatusAC('loading'))
    try {
        const res = await authAPI.logOut()
        if (res.resultCode === Result_Code.Ok) {
            dispatch(setIsLoggedInAC(false))
            dispatch(setAppStatusAC('succeeded'))
        } else {
            // console.log('else res: ', res)
            handleServerAppError(res, dispatch)
        }
    } catch (e: any) {
        handleServerNetworkError(e, dispatch)
    }
}

// types
type ActionsType = ReturnType<typeof setIsInitializedAC> | ReturnType<typeof setIsLoggedInAC>
                    | SetAppStatusActionType | SetAppErrorActionType
