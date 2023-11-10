import { useState, createContext } from 'react';
import { Routes, Route } from 'react-router-dom';

// 기본레이아웃
import Wrapper from '../_layout/wrapper';
import Error from '../_layout/_error';

// 개별 페이지
import Home from './home.jsx';

export default function Index() {
    const [ pages, setPages] = useState('/');
    const [ classes, setClasses] = useState();

    return (
        <Context.Provider value={{
            pages: pages,
            setPages: setPages,
            classes: classes,
            setClasses: setClasses,
        }}>
            <Wrapper>
                <div className={classes}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="*" state={{page:'error'}} element={<Error />} />
                    </Routes>
                </div>
            </Wrapper>
        </Context.Provider>
    );
}
export const Context = createContext();