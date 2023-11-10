import { useContext } from 'react';
import { Context } from '../home/index';
import Header from '../_layout/_header';
import Footer from '../_layout/_footer';

const Layout = ({children})=>{
    const { pages } = useContext(Context);
    return (
        <>
            {!['error', 'none_layout'].includes(pages) &&
                <Header />
            }
            {children}
            {!['error', 'none_layout'].includes(pages) &&
                <Footer />
            }
        </>
    );
}
export default Layout;