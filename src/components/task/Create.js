import React, { useState } from 'react'
import { IconLeft } from '../icons'
import secureApiFetch from '../../services/api';

export default function TaskCreateForm({match, history}) {
    const [newTask, setNewTask] = useState({ name: null, description: null, parser: null, project_id: match.params.id })
    const [loading, setLoading] = useState(false)
    const handleCreate = async () => {
        setLoading(true)
        await secureApiFetch(`/tasks`, { method: 'POST', body: JSON.stringify(newTask) })
        history.push(`/project/${match.params.id}`)
    }
    const handleFormChange = e => {
        const target = e.target;
        const name = target.name;
        const value = target.value;
        setNewTask({ ...newTask, [name]: value });
    };
    const handleGoBack = () => { history.goBack() }
    const allFieldsFilled = newTask.name && newTask.description && newTask.parser

    return (
        <div>
            <section className='heading' >
                <button onClick={handleGoBack}><IconLeft /></button>
                <h1 className='mr-auto ml-4'>Nueva tarea</h1>
            </section>
            <form onSubmit={e => e.preventDefault()}>
                <label htmlFor='name'>Name</label>
                <input autoFocus type="text" name="name" onChange={handleFormChange} />
                <label htmlFor='description'>Description</label>
                <input type="description" name="description" onChange={handleFormChange} />
                <label htmlFor='parser'>Parser</label>
                <select name="parser" onChange={handleFormChange}>
                    <option value='none'>none</option>
                    <option value='sqlmap'>sqlmap</option>
                    <option value='nmap'>nmap</option>
                </select>
              
                <button onClick={handleCreate} disabled={loading || !allFieldsFilled}>{loading ? 'Wait please' : 'Create'}</button>
                <button onClick={handleGoBack} disabled={loading} type='cancel'>Cancel</button>
            </form>
        </div>
    )
}