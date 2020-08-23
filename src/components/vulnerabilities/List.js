import React from 'react'
import { Link } from 'react-router-dom';
import DeleteButton from '../ui/buttons/Delete';
import useSetTitle from './../../hooks/useSetTitle'
import NoResults from '../ui/NoResults';
import Loading from '../ui/Loading';
import RiskBadge from '../badges/RiskBadge';
import useDelete from '../../hooks/useDelete';
import useFetch from '../../hooks/useFetch';
import CreateButton from '../ui/buttons/Create';

const VulnerabilitiesList = () => {
    useSetTitle('Vulnerabilities')

    const [vulnerabilities, update] = useFetch('/vulnerabilities')
    const destroy = useDelete('/vulnerabilities/', update);

    return (<>
        <div className='heading'>
            <h1>Vulnerabilities</h1>
            <CreateButton>Create Vulnerability</CreateButton>
        </div>
        {!vulnerabilities ? <Loading /> : vulnerabilities.length === 0 ? <NoResults />
            : <table className='w-full my-4'>
                <thead>
                    <tr>
                        <th>Summary</th>
                        <th>Risk</th>
                        <th>Status</th>
                        <th>Date/Time</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {vulnerabilities.map((vulnerability, index) => {
                        return (
                            <tr key={index}>
                                <td><Link className='flex flex-col' to={`/vulnerabilities/${vulnerability.id}`}>
                                    <span className='text-xl text-red-500'>{vulnerability.summary}</span>
                                    {vulnerability.description}
                                </Link></td>

                                <td><RiskBadge risk={vulnerability.risk} /></td>
                                <td>OPEN</td>
                                <td>{vulnerability.insert_ts}</td>

                                <td className='text-right   '><DeleteButton onClick={() => destroy(vulnerability.id)} /></td>
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        }
    </>)
}

export default VulnerabilitiesList