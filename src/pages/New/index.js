import './index.css'
import Sidebar from '../../components/Sidebar'
import Title from '../../components/Title'
import { FiEdit, FiPlusCircle } from 'react-icons/fi'
import { useState, useEffect, useContext } from 'react'
import { AuthContext } from '../../contexts/auth'
import { db } from '../../services/firebaseConnection'
import { collection, getDocs, getDoc, doc, addDoc, updateDoc } from 'firebase/firestore'
import { toast } from 'react-toastify'
import { useNavigate, useParams } from 'react-router-dom'

const listRef = collection(db, "customers");

export default function New() {
    const { user } = useContext(AuthContext)

    const { id } = useParams();

    const navigate = useNavigate();

    const [customerSelected, setCustomerSelected] = useState(0);

    const [customers, setCustomers] = useState([])
    const [loadCustomer, setLoadCustomer] = useState(true)

    const [servico, setServico] = useState('Massagem Relaxante')
    const [complemento, setComplemento] = useState('')
    const [status, setStatus] = useState('Pré-Atendimento')
    const [idCustomer, setIdCustomer] = useState(false)

    useEffect(() => {

        async function loadCustomers() {
            // eslint-disable-next-line no-unused-vars
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

                    if (id) {
                        loadId(lista);
                    }
                })
                .catch((error) => {
                    console.log("ERRO AO BUSCAR OS CLIENTES", error)
                    setLoadCustomer(false)
                    setCustomers([{ id: '1', nomeFantasia: "FREELA" }])
                })
        }
        loadCustomers();
    })

    async function loadId(lista) {
        const docRef = doc(db, 'chamados', id)
        await getDoc(docRef)
            .then((snapshot) => {
                setServico(snapshot.data().servico)
                setComplemento(snapshot.data().complemento)
                setStatus(snapshot.data().status)

                let index = lista.findIndex(item => item.id === snapshot.data().clienteID)
                setCustomerSelected(index);
                setIdCustomer(true)
            })
            .catch((error) => {
                console.log(error)
                setIdCustomer(false)
            })
    }

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

        if (idCustomer) {
            const docRef = doc(db, 'chamados', id)
            await updateDoc(docRef, {
                cliente: customers[customerSelected].nomeFantasia,
                clienteID: customers[customerSelected].id,
                servico: servico,
                complemento: complemento,
                status: status,
                userID: user.uid,
            })
                .then(() => {
                    toast.success('Atualizado com sucesso')
                    setCustomerSelected(0)
                    setComplemento('')
                    navigate('/dashboard')
                })
                .catch((error) => {
                    toast.error('Opa! Alguma coisa deu errado.')
                    console.log(error)
                })
            return;
        }

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
                <Title name={id ? 'Editando Serviço' : "Novo Serviço"}>
                    <span>
                        {id ? <FiEdit size={25} /> : <FiPlusCircle size={25} />}
                    </span>
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
