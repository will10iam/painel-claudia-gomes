import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Title from '../../components/Title';



import './index.css'

import { FiMessageSquare, FiPlus, FiSearch, FiEdit2 } from 'react-icons/fi';

export default function Dashboard() {


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