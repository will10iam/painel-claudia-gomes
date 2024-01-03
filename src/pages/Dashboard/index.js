import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Title from '../../components/Title';
import './index.css'
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebaseConnection';
import { collection, orderBy, limit, getDocs, startAfter, query } from "firebase/firestore";
import { format } from "date-fns";


const listRef = collection(db, 'chamados');




export default function Dashboard() {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);


    useEffect(() => {
        async function loadServiços() {
            const q = query(listRef, orderBy('created', 'desc'), limit(2));

            const querySnapshot = await getDocs(q);
            await updateState(querySnapshot);

            setLoading(false);
        }
        loadServiços();
        return (() => { })
    }, []);

    async function updateState(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    assunto: doc.data().assunto,
                    cliente: doc.data().cliente,
                    clienteID: doc.data().clienteID,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    complemento: doc.data().complemento,
                    status: doc.data().status,
                })
            })

            setChamados(chamados => [...chamados, ...lista])
        } else {
            setIsEmpty(true)
        }
    }

    if (loading) {
        return (
            <div>
                <Sidebar />
                <div className='content'>
                    <Title name='Serviços'>
                        <FiMessageSquare size={25} />
                    </Title>

                    <div className='container dashboard'>
                        <span>Buscando serviços...</span>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <>
            <Sidebar />
            <div className='content'>
                <Title name="Serviços">
                    <FiMessageSquare size={25} />
                </Title>

                <>
                    <Link to="/new" className='new'>
                        <FiPlus color="#FFF" size={25} />
                        Novo Serviço
                    </Link>

                    <table>
                        <thead>
                            <tr>
                                <th scope="col">Clientes</th>
                                <th scope="col">Serviço</th>
                                <th scope="col">Status</th>
                                <th scope="col">Cadastrado em</th>
                                <th scope="col">#</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td data-label="Cliente">Maria Amália</td>
                                <td data-label="Serviço">Massagem</td>
                                <td data-label="Status">
                                    <span className="badge" style={{ backgroundColor: '#999' }}>
                                        Em Aberto
                                    </span>
                                </td>
                                <td data-label="Cadastrado">08/11/2023</td>
                                <td data-label="#">
                                    <button className="action" style={{ backgroundColor: '#3583f6' }}>
                                        <FiSearch color='#FFF' size={17} />
                                    </button>
                                    <button className="action" style={{ backgroundColor: '#f6a935' }}>
                                        <FiEdit2 color='#FFF' size={17} />
                                    </button>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </>

            </div>
        </>
    )
}