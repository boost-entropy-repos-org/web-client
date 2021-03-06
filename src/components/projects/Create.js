import Project from 'models/Project';
import React, { useState } from 'react';
import { Link } from "react-router-dom";
import secureApiFetch from "../../services/api";
import Breadcrumb from '../ui/Breadcrumb';
import { IconPlus } from '../ui/Icons';
import Title from '../ui/Title';
import ProjectForm from "./Form";

const ProjectCreate = ({ history }) => {

    const [newProject, setNewProject] = useState(Project);

    const handleCreate = async (ev) => {
        ev.preventDefault();

        await secureApiFetch(`/projects`, { method: 'POST', body: JSON.stringify(newProject) })
        history.push('/projects');
    }

    return (
        <div>
            <div className="heading">
                <Breadcrumb>
                    <Link to="/projects">Projects</Link>
                </Breadcrumb>
            </div>
            <Title title="New project details" icon={<IconPlus />} />

            <ProjectForm project={newProject} projectSetter={setNewProject} onFormSubmit={handleCreate} />
        </div>
    )
}

export default ProjectCreate
