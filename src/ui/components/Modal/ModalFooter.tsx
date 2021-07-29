import clsx from 'clsx';
import * as React from 'react';

export type ModalFooterProps = React.HTMLProps<HTMLDivElement> & {
    children?: React.ReactFragment;
};

const ModalFooter: React.FC<ModalFooterProps> = (props: ModalFooterProps) => {
    const {children, className, ...elProps} = props;

    return (
        <div className={clsx('ModalFooter', className)} {...elProps}>
            {children}
        </div>
    );
};

export default ModalFooter;
