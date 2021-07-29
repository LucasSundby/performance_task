import {createContext} from 'react';
import {CloseSource} from './Modal';

type ModalContextProps = {
    closeButton: boolean;
    onCloseRequest: (cs: CloseSource) => void;
}

const ModalContext = createContext<ModalContextProps>({closeButton: false, onCloseRequest: () => undefined});
ModalContext.displayName = 'ModalContext';

export default ModalContext;
