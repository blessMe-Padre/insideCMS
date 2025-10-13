
import styles from './style.module.css';

export default function Popup({ activePopup, setActivePopup, children }) {

    const handleKeyDown = (event) => {
        if (event.key === 'Escape' || event.key === 'Esc') {
            setActivePopup(false);
        }
    }

    return (

        <div
            className={`${styles.popup} ${activePopup ? styles.popupActive : styles.popupNone}`}
            onClick={() => { setActivePopup(false) }}
            onKeyDown={handleKeyDown}
            tabIndex={0}
        >
            <div className={styles.popup__body}>

                <div
                    className={styles.popup__content}
                    onClick={e => e.stopPropagation()}
                >


                    <button
                        className={styles.popup__close}
                        onClick={() => { setActivePopup(false) }}
                    >
                        <svg width="23" height="22" viewBox="0 0 23 22" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <rect x="3" y="18.4463" width="21.8033" height="0.726776" rx="0.363388" transform="rotate(-45 3 18.4463)" />
                            <rect x="4.21094" y="3" width="21.8033" height="0.726776" rx="0.363388" transform="rotate(45 4.21094 3)" />
                        </svg>
                    </button>

                    {children}
                </div>
            </div>
        </div>
    )
}
