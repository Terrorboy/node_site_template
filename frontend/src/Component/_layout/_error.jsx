import { useContext, useEffect } from 'react';
import { Context } from '../home/index';
import { Link, useLocation } from 'react-router-dom';

export default function Error() {
    const { pages, setPages, setClasses } = useContext(Context);
    const location = useLocation();
    useEffect(() => {
        setPages('error');
        setClasses('error');
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pages]);

    return (
        <>
            <div className="error_page">
                {location.pathname}페이지를 찾을 수 없습니다.<br />
                <Link to="/">Home</Link>
            </div>
        </>
    );
}