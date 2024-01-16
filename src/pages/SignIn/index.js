import { useState, useContext } from "react"
import './index.css'
import cglogo from '../../assets/claudia gomes.png'
import { Link } from "react-router-dom"

import { AuthContext } from '../../contexts/auth'


export default function SignIn() {

    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const { signIn, loadingAuth } = useContext(AuthContext);

    async function handleSubmit(e) {
        e.preventDefault();

        if (email !== '' && password !== '') {
            await signIn(email, password);
        }
    }

    return (
        <div className="container-center">
            <div className="login">
                <div className="login-area">
                    <img src={cglogo} alt='logo' />
                </div>

                <form onSubmit={handleSubmit}>
                    <h1>Entrar</h1>
                    <input
                        text="email"
                        placeholder="Seu email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />

                    <input
                        type="password"
                        text="password"
                        placeholder="Sua senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />

                    <button type="submit">
                        {loadingAuth ? "Carregando.." : "Acessar"}
                    </button>
                </form>

                <Link to="/register">Criar uma conta!</Link>

            </div>
        </div>
    )
}