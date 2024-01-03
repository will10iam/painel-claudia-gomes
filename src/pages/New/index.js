import './index.css'

import Sidebar from '../../components/Sidebar'
import Title from '../../components/Title'

import { FiPlusCircle } from 'react-icons/fi'


import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'

import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'

const listRef = collection(db, "customers");


export default function New() {
    const { user } = useContext(AuthContext)

    const [customerSelected, setCustomerSelected] = useState(0);

    const [customers, setCustomers] = useState([])
    const [loadCustomer, setLoadCustomer] = useState(true)


    const [servico, setServico] = useState('Massagem Relaxante')
    const [complemento, setComplemento] = useState('')
    const [status, setStatus] = useState('Pré-Atendimento')



    useEffect(() => {
        async function loadCustomers() {
            const querySnapshot = await getDocs(listRef)
                .then((snapshot) => {
                    let lista = [];

                    snapshot.forEach((doc) => {
                        lista.push({
                            id: doc.id,
                            nomeFantasia: doc.data().nomeFantasia
                        })
                    })

                    if (snapshot.docs.size === 0) {
                        console.log("NENHUM CLIENTE CADASTRADO")
                        setCustomers([{ id: '1', nomeFantasia: "FREELA" }])
                        setLoadCustomer(false)
                        return;
                    }

                    setCustomers(lista)
                    setLoadCustomer(false)
                })
                .catch((error) => {
                    console.log("ERRO AO BUSCAR OS CLIENTES", error)
                    setLoadCustomer(false)
                    setCustomers([{ id: '1', nomeFantasia: "FREELA" }])
                })
        }
        loadCustomers();
    }, [])

    function handleOptionChange(e) {
        setStatus(e.target.value)
    }

    function handleChangeSelect(e) {
        setServico(e.target.value)
    }

    function handleChangeCustomer(e) {
        setCustomerSelected(e.target.value)
    }

    async function handleRegister(e) {
        e.preventDefault();

        await addDoc(collection(db, 'chamados'), {
            created: new Date(),
            cliente: customers[customerSelected].nomeFantasia,
            clienteID: customers[customerSelected].id,
            servico: servico,
            complemento: complemento,
            status: status,
            userID: user.uid,
        })
            .then(() => {
                toast.success('CHAMADO REGISTRADO COM SUCESSO')
                setComplemento('')
                setCustomerSelected(0)
            }).catch((error) => {
                toast.error('ERRO AO REGISTRAR, VERIFIQUE OS CAMPOS E TENTE NOVAMENTE')
                console.log(error);
            })
    }

    return (
        <div>
            <Sidebar />

            <div className='content' >
                <Title name="Novo Serviço">
                    <FiPlusCircle size={25} />
                </Title>

                <div className='container'>
                    <form className='form-profile' onSubmit={handleRegister}>
                        <label>Cliente</label>
                        {loadCustomer ? (
                            <input type='text' disabled={true} value='Carregando...' />
                        ) : (
                            <select value={customerSelected} onChange={handleChangeCustomer}>
                                {customers.map((item, index) => {
                                    return (
                                        <option key={index} value={index}>
                                            {item.nomeFantasia}
                                        </option>
                                    )
                                })}
                            </select>
                        )}


                        <label>Serviço</label>
                        <select value={servico} onChange={handleChangeSelect}>
                            <option value="Massagem Relaxante">Massagem Relaxante</option>
                            <option value="Epilação">Epilação</option>
                            <option value="Limpeza de Pele">Limpeza de Pele</option>
                        </select>


                        <label>Status</label>
                        <div className='status'>
                            <input
                                type='radio'
                                name='radio'
                                value='Pré-Atendimento'
                                onChange={handleOptionChange}
                                checked={status === 'Pré-Atendimento'}
                            />
                            <span>Pré-Atendimento</span>

                            <input
                                type='radio'
                                name='radio'
                                value='Em Atendimento'
                                onChange={handleOptionChange}
                                checked={status === 'Em Atendimento'}
                            />
                            <span>Em Atendimento</span>

                            <input
                                type='radio'
                                name='radio'
                                value='Finalizado'
                                onChange={handleOptionChange}
                                checked={status === 'Finalizado'}
                            />
                            <span>Finalizado</span>
                        </div>

                        <label>Complemento</label>
                        <textarea
                            type="text"
                            placeholder='descreva o serviço'
                            value={complemento}
                            onChange={(e) => setComplemento(e.target.value)}
                        />

                        <button type='submit'>Registrar</button>
                    </form>
                </div>
            </div>


        </div>
    )
}
