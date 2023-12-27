import { useState } from 'react'

import Sidebar from '../../components/Sidebar'
import Title from '../../components/Title'

import './index.css'

import { FiUser } from 'react-icons/fi'

import { db } from '../../services/firebaseConnection'
import { addDoc, collection } from "firebase/firestore"
import { toast } from "react-toastify"



export default function Customers() {
    const [nome, setNome] = useState("")
    const [cnpj, setCnpj] = useState("")
    const [endereco, setEndereco] = useState("")


    async function handleRegister(e) {
        e.preventDefault();

        if (nome !== '' && cnpj !== '' && endereco !== '') {
            await addDoc(collection(db, "customers"), {
                nomeFantasia: nome,
                cnpj: cnpj,
                endereco: endereco
            })
                .then(() => {
                    setNome('')
                    setCnpj('')
                    setEndereco('')
                    toast.success("Cadastrado com sucesso")
                }).catch((error) => {
                    console.log(error)
                    toast.error("Erro ao fazer o cadastro!")
                })
        } else {
            toast.error("Preencha os campos corretamente")
        }

    }


    return (
        <div>
            <Sidebar />

            <div className='content'>
                <Title name="Novo Cliente">
                    <FiUser size={25} />
                </Title>



                <div className='container'>
                    <form className="form-profile" onSubmit={handleRegister}>
                        <label>Nome do cliente</label>
                        <input
                            type="text"
                            placeholder='nome do cliente aqui'
                            value={nome}
                            onChange={(e) => setNome(e.target.value)}
                        />

                        <label>CNPJ/CPF</label>
                        <input
                            type="number"
                            placeholder='CNPJ do cliente aqui'
                            value={cnpj}
                            onChange={(e) => setCnpj(e.target.value)}
                        />

                        <label>Endereço</label>
                        <input
                            type="text"
                            placeholder='endereco do cliente aqui'
                            value={endereco}
                            onChange={(e) => setEndereco(e.target.value)}
                        />

                        <button type='submit'>Salvar</button>
                    </form>
                </div>
            </div>
        </div>
    )
}