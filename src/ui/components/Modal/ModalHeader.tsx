import {mdiClose} from '@mdi/js';
import Icon from '@mdi/react';
import clsx from 'clsx';
import * as React from 'react';
import {CloseSource} from './Modal';
import ModalContext from './ModalContext';

export type ModalHeaderProps = React.HTMLProps<HTMLDivElement> & {
    children?: React.ReactFragment;
};

const ModalHeader: React.FC<ModalHeaderProps> = (props: ModalHeaderProps) => {
    const {children, className, ...elProps} = props;

    return (
        <ModalContext.Consumer>{ctx => (
            <div className={clsx('ModalHeader', className)} {...elProps}>
                {ctx.closeButton ? (
                    <button className="CloseButton" onClick={() => ctx.onCloseRequest(CloseSource.HEADER)} aria-label="Close"><Icon path={mdiClose} size={1} aria-hidden={true}/></button>
                ) : null}
                {children}
            </div>
        )}</ModalContext.Consumer>
    );
};

export default ModalHeader;
