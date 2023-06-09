import { ethers } from 'ethers';

const Navigation = ({ account, setAccount }) => {
    const connectHandler = async () => { 
        const accounts = await window.ethereum.request({method: 'eth_requestAccounts'});
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account)
    }

    return (
        <nav>
            <div className='nav__brand'>
                <h1>STILE DI VITA</h1>
                
                
            </div>

            <p>Barcelona 1996</p>


        {account ? ( 
            <button
                type="button"
                className="nav__connect"
            >
                {account.slice(0, 6) + '...' + account.slice(38, 42)}
            </button>
        ) : ( 
            <button
                type="button"
                className="nav__connect"
                onClick={connectHandler}
            >
                Connect
            </button>
        )}
        

        <ul className='nav__links'> 
            <li><a href="#Selección de ropa">Explora nuestra selección de ropa</a></li>
            <li><a href="#Colección de relojes">Sumérgete en nuestra colección de relojes</a></li>
            <li><a href="#Colección de bolsos">Descubre nuestra colección de bolsos</a></li>
        </ul>

        </nav>
    );
}

export default Navigation;