import React, {useState} from 'react'
import VulnerabilitiesTable from '../vulnerabilities/VulnerabilitiesTable'
import Loading from '../ui/Loading'
import {IconFlag, IconPlus} from '../ui/Icons'
import {useHistory} from 'react-router-dom'
import BtnSecondary from '../ui/buttons/BtnSecondary'
import ButtonGroup from '../ui/buttons/ButtonGroup'


const ProjectVulnerabilities = ({project, vulnerabilities}) => {
    const history = useHistory();

    const handleCreateVulnerability = () => {
        history.push(`/vulnerabilities/create?projectId=${project.id}`)
    }

    const [category, setCategory] = useState('')
    const [risk, setRisk] = useState('')
    const [status, setStatus] = useState('')
    return <section>
        <h4><IconFlag/> Vulnerabilities
            <ButtonGroup>
                {vulnerabilities &&
                <VulnerabilityFilters vulnerabilities={vulnerabilities} setRisk={setRisk} setCategory={setCategory}
                                      setStatus={setStatus}/>}
                <BtnSecondary onClick={handleCreateVulnerability}>
                    <IconPlus/>
                    Add New Vulnerability
                </BtnSecondary>
            </ButtonGroup>
        </h4>
        {vulnerabilities ?
            <VulnerabilitiesTable
                vulnerabilities={vulnerabilities.filter(vuln => vuln.category_name && vuln.category_name.includes(category) && vuln.risk.includes(risk) && vuln.status.includes(status))}/>
            : <Loading/>}
    </section>
}

export default ProjectVulnerabilities


const VulnerabilityFilters = ({vulnerabilities, setCategory, setRisk, setStatus}) => {
    const handleSetCategory = ev => {
        setCategory(ev.target.value)
    }
    const handleSetRisk = ev => {
        setRisk(ev.target.value)
    }
    const handleSetStatus = ev => {
        setStatus(ev.target.value)
    }
    return <div className='space-x-2 mx-auto flex items-center '>
        <div>
            <label>Risk</label>
            <select onChange={handleSetRisk}>
                <option value=''>Any</option>
                {[...new Set(vulnerabilities.map(vuln => vuln.risk))]
                    .map((risk, index) => <option value={risk} key={index}>{risk.toUpperCase()}</option>)}
            </select>
        </div>

        <div>
            <label>Category</label>
            <select onChange={handleSetCategory}>
                <option value=''>Any</option>
                {[...new Set(vulnerabilities.map(vuln => vuln.category_name))]
                    .map((cat, index) => <option value={cat} key={index}>{cat}</option>)}
            </select>
        </div>
        <div>
            <label>Status</label>
            <select onChange={handleSetStatus}>
                <option value=''>Any</option>
                <option value='open'>Open</option>
                <option value='closed'>Closed</option>
            </select>
        </div>
    </div>
}
