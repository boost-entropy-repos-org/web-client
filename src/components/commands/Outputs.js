import DeleteButton from "components/ui/buttons/Delete";
import PrimaryButton from "components/ui/buttons/Primary";
import SecondaryButton from "components/ui/buttons/Secondary";
import FileSizeSpan from "components/ui/FileSizeSpan";
import { IconUpload } from "components/ui/Icons";
import Loading from "components/ui/Loading";
import ModalDialog from "components/ui/ModalDIalog";
import NoResultsTableRow from "components/ui/NoResultsTableRow";
import useFetch from "hooks/useFetch";
import { useState } from "react";
import ReactTimeAgo from "react-time-ago/commonjs/ReactTimeAgo";
import secureApiFetch from "services/api";
import { actionCompletedToast } from "../ui/toast";

const CommandOutputs = ({ task }) => {
    const [commandOutputs, updateCommandOutputs] = useFetch(`/attachments?parentType=command&parentId=${task.id}`)
    const [modalVisible, setModalVisible] = useState(false);
    const [content, setContent] = useState(null);

    const onDeleteOutputClick = (ev, attachmentId) => {
        ev.preventDefault();

        secureApiFetch(`/attachments/${attachmentId}`, { method: 'DELETE' })
            .then(() => {
                actionCompletedToast("The output has been deleted.");
                updateCommandOutputs();
            })
            .catch(err => console.error(err))
    }

    const onDownloadClick = (ev, attachmentId) => {
        secureApiFetch(`/attachments/${attachmentId}`, { method: 'GET', headers: {} })
            .then(resp => {
                const contentDispositionHeader = resp.headers.get('Content-Disposition');
                const filenameRe = new RegExp(/filename="(.*)";/)
                const filename = filenameRe.exec(contentDispositionHeader)[1]
                return Promise.all([resp.blob(), filename]);
            })
            .then((values) => {
                const blob = values[0];
                const filename = values[1];
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = filename;
                a.click();
            })
    }

    const onViewClick = (ev, attachmentId) => {
        secureApiFetch(`/attachments/${attachmentId}`, { method: 'GET', headers: {} })
            .then(resp => {
                const contentDispositionHeader = resp.headers.get('Content-Disposition');
                const filenameRe = new RegExp(/filename="(.*)";/)
                const filename = filenameRe.exec(contentDispositionHeader)[1]
                return Promise.all([resp.blob(), filename]);
            })
            .then(async (values) => {
                const blob = values[0];
                setContent(await blob.text());
                setModalVisible(true);
            })
    }

    const onModalClose = () => {
        setModalVisible(false);
    }

    if (!commandOutputs) return <Loading />

    return <>
        {task.command_id &&
            <>
                <ModalDialog visible={modalVisible} title="Preview output" onModalClose={onModalClose} style={{ width: '80%', height: '80%', maxHeight: '80%' }}>
                    <textarea style={{ width: '100%', height: '90%' }}>
                        {content}
                    </textarea>
                </ModalDialog>

                <h4>
                    Results
                    <PrimaryButton to={`/tasks/${task.id}/upload`}>
                        <IconUpload /> Upload results
                    </PrimaryButton>
                </h4>
                {!commandOutputs ? <Loading /> :

                    <table>
                        <thead>
                            <th>Upload date</th>
                            <th>Uploaded by</th>
                            <th>Filename</th>
                            <th>File size</th>
                            <th>Mimetype</th>
                            <th>&nbsp;</th>
                        </thead>
                        <tbody>
                            {commandOutputs.length === 0 && <NoResultsTableRow numColumns={5} />}
                            {commandOutputs.map((commandOutput, index) =>
                                <tr key={index}>
                                    <td><ReactTimeAgo date={commandOutput.insert_ts} /></td>
                                    <td>{commandOutput.submitter_name}</td>
                                    <td>{commandOutput.client_file_name}</td>
                                    <td><FileSizeSpan fileSize={commandOutput.file_size} /></td>
                                    <td>{commandOutput.file_mimetype}</td>
                                    <td className="flex justify-end">
                                        <SecondaryButton onClick={ev => onViewClick(ev, commandOutput.id)}>View</SecondaryButton>
                                        <SecondaryButton onClick={ev => onDownloadClick(ev, commandOutput.id)}>Download</SecondaryButton>
                                        <DeleteButton onClick={ev => onDeleteOutputClick(ev, commandOutput.id)} />
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                }
            </>
        }
    </>
}

export default CommandOutputs;
