import { useState, useContext } from "react"
import '../SignIn/index.css'
import cglogo from '../../assets/claudia gomes.png'
import { Link } from "react-router-dom"

import { AuthContext } from '../../contexts/auth'


export default function SignUp() {
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signUp, loadingAuth } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();

        if (name !== '' && email !== '' && password !== '') {
            await signUp(email, password, name)
        }
    }

    return (
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={cglogo} alt='logo' />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Nova Conta</h1>
                    <input
                        text="name"
                        placeholder="Seu nome"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <input
                        text="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        text="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        {loadingAuth ? "Carregando..." : "Cadastrar"}
                    </button>
                </form>

                <Link to="/">Já possui uma conta? Logue Aqui!</Link>

            </div>
        </div>
    )
}