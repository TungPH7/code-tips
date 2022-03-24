import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from "react-bootstrap";
import { Button } from '../button/Button';
import { postApproveArchive, postRejectArchive } from '../../../services/ProjectAdministrationService';
import { useNavigate } from 'react-router-dom';
import './styles.scss';

const ConfirmArchive = (props) => {
    const { isShow = false, handleClose, projectId, setHasArchive } = props
    const navigate = useNavigate()

    const handleAppoveArchive = async () => {
        handleClose()

        try {
            const response = await postApproveArchive(projectId)
            if (response.status === 200 && response.data === 'Archive Successfully') {
                navigate('/projects')
            }
        } catch (err) {
            console.log(err)
        }
    }

    const handleRejectArchive = async () => {
        handleClose()
        setHasArchive()
        try {
            const response = await postRejectArchive(projectId)
            if (response.status === 200 && response.data === 'Reject Successfully') {
                handleClose()
            }
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <Modal className='request-archive' show={isShow} onHide={handleClose}>
            <Modal.Header closeButton>
            </Modal.Header>
            <div className='request-archive__body'>
                <h4 className='request-archive__title is-admin'>Request Archive</h4>
                <p className='request-archive__text'>
                    Please confirm archive creation for this project
                </p>
            </div>
            <Modal.Footer>
                <div className='request-archive__btn-control d-flex'>
                    <Button className='request-archive__btn-cancel' name='Reject' isBorder={false} handleClick={handleRejectArchive} />
                    <Button
                        className='request-archive__btn-confirm'
                        name='Approve'
                        handleClick={handleAppoveArchive}
                    />
                </div>
            </Modal.Footer>
        </Modal>
    )
}

ConfirmArchive.propTypes = {
    isShow: PropTypes.bool,
    handleClose: PropTypes.func,
    setHasArchive: PropTypes.func,
    projectId: PropTypes.string,
    archiveStatus: PropTypes.string
}

export { ConfirmArchive }