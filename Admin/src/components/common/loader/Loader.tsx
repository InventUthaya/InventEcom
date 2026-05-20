import './Loader.css';

type Props = {
    isOpen: boolean
}

const Loader = ({ isOpen }: Props) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-999999 flex items-center justify-center bg-opacity-40 backdrop-blur-sm">
            <div className='flex justify-center items-center'>
                <div className="corners">
                    <div className="corner corner--1"></div>
                    <div className="corner corner--2"></div>
                    <div className="corner corner--3"></div>
                    <div className="corner corner--4"></div>
                </div>
            </div>
        </div>
    );
};

export default Loader;
