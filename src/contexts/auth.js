import { useState, createContext, useEffect } from "react";
import { db, auth } from '../services/firebaseConnection'
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth'
import { getDoc, doc, setDoc } from 'firebase/firestore'
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

export const AuthContext = createContext({});

function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loadingAuth, setLoadingAuth] = useState(false);
    const [loading, setLoading] = useState(true);

    const navigate = useNavigate();

    useEffect(() => {
        async function loadUSer() {
            const storageUser = localStorage.getItem('@claudia')

            if (storageUser) {
                setUser(JSON.parse(storageUser))
                setLoading(false)
            }
            setLoading(false)
        }
        loadUSer();
    }, [])

    async function signIn(email, password) {
        setLoadingAuth(true);

        await signInWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid

                const docRef = doc(db, "users", uid);
                const docSnap = await getDoc(docRef);

                let data = {
                    uid: uid,
                    nome: docSnap.data().nome,
                    email: value.user.email,
                    avatarUrl: docSnap.data().avatarUrl
                }

                setUser(data)
                storageUser(data)
                setLoadingAuth(false)
                toast.success("Bem vindo " + docSnap.data().nome)
                navigate("/dashboard")

            }).catch((error) => {
                console.log(error)
                setLoadingAuth(false);
                toast.error("Algo não funcionou, tente novamente!")
            })
    }

    async function signUp(email, password, name) {
        setLoadingAuth(true);

        await createUserWithEmailAndPassword(auth, email, password)
            .then(async (value) => {
                let uid = value.user.uid

                await setDoc(doc(db, "users", uid), {
                    nome: name,
                    avatarUrl: null
                }).then(() => {

                    let data = {
                        uid: uid,
                        nome: name,
                        email: value.user.email,
                        avatarUrl: null
                    }

                    setUser(data)
                    storageUser(data)
                    setLoadingAuth(false)
                    toast.success("Cadastrado com sucesso!")
                    navigate("/");
                })
            }).catch((error) => {
                console.log(error)
                setLoadingAuth(false)
                toast.error("Algo não funcionou, tente novamente!")
            })
    }


    function storageUser(data) {
        localStorage.setItem('@claudia', JSON.stringify(data))
    }

    async function logout() {
        await signOut(auth)
        localStorage.removeItem('@claudia')
        setUser(null)
    }

    return (
        <AuthContext.Provider
            value={{
                signed: !!user,
                user,
                signIn,
                signUp,
                logout,
                loadingAuth,
                loading


            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export default AuthProvider;