import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import './index.css'; // Import the CSS file for styles

const Modal = ({ isOpen, onClose, title, children, onSubmit, ButtonTitle, DeleteButtonTitle, onDelete }) => {
        
    const handleEnter = (event) => {
        if (event.key === 'Enter') {
            onSubmit();
            onClose();
        }
    };
    
    useEffect(() => {
    
        window.addEventListener('keydown', handleEnter);

        return () => window.removeEventListener('keydown', handleEnter);
    }, []);

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <header className="modal-header">
                    <h2>{title}</h2>
                    <button className="close-button" onClick={onClose}>
                        &times;
                    </button>
                </header>
                <div className="modal-body">
                    {children}
                </div>
                <footer className="modal-footer">
                    {onDelete && <button className="footer-button-delete" onClick={onDelete}>
                        {DeleteButtonTitle? DeleteButtonTitle :"Delete"}
                    </button>}
                    <button className="footer-button" onClick={onSubmit}>
                        {ButtonTitle? ButtonTitle :"Submit"}
                    </button>
                </footer>
            </div>
        </div>,
        document.getElementById('modal-root')
    );
};

export default Modal;
