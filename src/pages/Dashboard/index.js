import { useEffect, useState } from 'react';
import Sidebar from '../../components/Sidebar';
import Title from '../../components/Title';
import './index.css'
import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { db } from '../../services/firebaseConnection';
import { collection, orderBy, limit, getDocs, startAfter, query } from "firebase/firestore";
import { format } from "date-fns";
import Modal from '../../components/Modal';


const listRef = collection(db, 'chamados');




export default function Dashboard() {
    const [chamados, setChamados] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isEmpty, setIsEmpty] = useState(false);
    const [lastDoc, setLastDoc] = useState();
    const [loadingMore, setLoadingMore] = useState(false);

    const [showPostModal, setShowPostModal] = useState(false);
    const [detail, setDetail] = useState();

    useEffect(() => {
        async function loadServicos() {
            const q = query(listRef, orderBy('created', 'desc'), limit(2));

            const querySnapshot = await getDocs(q);
            setChamados([]);
            await updateState(querySnapshot);

            setLoading(false);

        }
        loadServicos();
        return (() => { })
    }, []);

    async function updateState(querySnapshot) {
        const isCollectionEmpty = querySnapshot.size === 0;

        if (!isCollectionEmpty) {
            let lista = [];

            querySnapshot.forEach((doc) => {
                lista.push({
                    id: doc.id,
                    cliente: doc.data().cliente,
                    clienteID: doc.data().clienteID,
                    created: doc.data().created,
                    createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
                    complemento: doc.data().complemento,
                    status: doc.data().status,
                    servico: doc.data().servico,
                })
            })

            const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1];

            setChamados(chamados => [...chamados, ...lista])
            setLastDoc(lastDoc);

        } else {
            setIsEmpty(true)
        }

        setLoadingMore(false);
    }

    async function handleMore() {
        setLoadingMore(true);

        const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDoc), limit(2))
        const querySnapshot = await getDocs(q);
        await updateState(querySnapshot);
    }

    function toggleModal(item) {
        setShowPostModal(!showPostModal)
        setDetail(item)
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
                    {chamados.lenght === 0 ? (
                        <div className='container dashboard'>
                            <span>Nenhum serviço encontrado..</span>
                            <Link to="/new" className='new'>
                                <FiPlus color="#FFF" size={25} />
                                Novo Serviço
                            </Link>
                        </div>


                    ) : (
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
                                    {chamados.map((item, index) => {
                                        return (
                                            <tr key={index}>
                                                <td data-label="Cliente">{item.cliente}</td>
                                                <td data-label="Serviço">{item.servico}</td>
                                                <td data-label="Status">
                                                    <span className="badge" style={{ backgroundColor: item.status === 'Pré-Atendimento' ? '#3583f6' : item.status === 'Em Atendimento' ? '#f6a935' : item.status === 'Finalizado' ? '#5cb85c' : '#999' }}>
                                                        {item.status}
                                                    </span>
                                                </td>
                                                <td data-label="Cadastrado">{item.createdFormat}</td>
                                                <td data-label="#">
                                                    <button className="action" style={{ backgroundColor: '#f3bca8' }} onClick={() => toggleModal(item)}>
                                                        <FiSearch color='#5D4440' size={17} />
                                                    </button>
                                                    <Link to={`/new/${item.id}`} className="action" style={{ backgroundColor: '#5D4440' }}>
                                                        <FiEdit2 color='#FFF' size={17} />
                                                    </Link>
                                                </td>
                                            </tr>
                                        )
                                    })}

                                </tbody>
                            </table>

                            {loadingMore && <h3>Buscando mais serviços...</h3>}
                            {!loadingMore && !isEmpty && <button className='btn-more' onClick={handleMore}>Buscar Mais</button>}
                        </>
                    )}
                </>
            </div >

            {showPostModal && (
                <Modal
                    conteudo={detail}
                    close={() => setShowPostModal(!showPostModal)}
                />
            )}
        </>
    )
}