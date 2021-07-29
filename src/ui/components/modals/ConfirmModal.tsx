import * as React from 'react';
import Button from '../Button';

import Modal from '../Modal/Modal';

export type ConfirmModalProps = {
    show: boolean;
    onComplete: (confirmed: boolean) => void;
    title?: string;
    children: React.ReactFragment
};

const ConfirmModal: React.FC<ConfirmModalProps> = (props: ConfirmModalProps) => {
    function onComplete(confirmed: boolean) {
        if (typeof props.onComplete === 'function') {
            props.onComplete(confirmed);
        }
    }

    function sendFalse() {
        onComplete(false);
    }

    function sendTrue() {
        onComplete(true);
    }

    return (
        <Modal show={props.show} onCloseRequest={sendFalse} aria-label="Confirmation Dialog" closeButton>
            <Modal.Header>{props.title || 'Confirm'}</Modal.Header>
            <Modal.Body>
                {props.children}
                <div className="text-right">
                    <Button type="button" variant="gray" onClick={sendFalse}>Cancel</Button>
                    <Button type="button" variant="blue" onClick={sendTrue} className="ml-1">Confirm</Button>
                </div>
            </Modal.Body>
        </Modal>
    );
};

export default ConfirmModal;
