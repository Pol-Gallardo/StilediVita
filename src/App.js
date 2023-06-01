import { useEffect, useState } from 'react'
import { ethers } from 'ethers'


// Components
import Navigation from './components/Navigation'
import Section from './components/Section'
import Product from './components/Product'

// ABIs
import Stile from './abis/Stile.json'

// Config
import config from './config.json'

function App() {
  const [provider, setProvider] = useState(null)
  const [stile, setStile] = useState(null)

  const [account, setAccount] = useState(null)

  const [relojes, setRelojes] = useState(null)
  const [clothing, setClothing] = useState(null)
  const [bolsos, setBolsos] = useState(null)

  const [item, setItem] = useState({})
  const [toggle, setToggle] = useState(false)
  const [showNotice, setShowNotice] = useState(true);

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const closeNotice = () => {
    setShowNotice(false);
  };

  const loadBlockchainData = async () => {
    let provider;
  
    // Connect to blockchain
    if (window.ethereum) {
      provider = new ethers.providers.Web3Provider(window.ethereum);
      window.ethereum.on('accountsChanged', handleAccountsChanged);
    } else {
      provider = new ethers.providers.JsonRpcProvider('https://eth-sepolia.g.alchemy.com/v2/1swcbrxABEmfMryTj2YNLk2VLAJwRuzY');
    }
    setProvider(provider);
  
    const network = await provider.getNetwork();
    console.log(network);
    // Connect to smart contracts
    const stile = new ethers.Contract(config[network.chainId].stile.address, Stile, provider);
    setStile(stile);
    // Load products
    const items = [];
  
    for (var i = 0; i < 9; i++) {
      const item = await stile.items(i + 1);
      items.push(item);
    }
    const relojes = items.filter((item) => item.category === 'relojes');
    const clothing = items.filter((item) => item.category === 'clothing');
    const bolsos = items.filter((item) => item.category === 'bolsos');
  
    setRelojes(relojes);
    setClothing(clothing);
    setBolsos(bolsos);
  
    // Load account
    if (provider) {
      const accounts = await provider.listAccounts();
      if (accounts.length > 0) {
        const account = ethers.utils.getAddress(accounts[0]);
        setAccount(account);
      } else {
        setAccount(null);
      }
    }
  };
  
  const handleAccountsChanged = (accounts) => {
    if (accounts.length > 0) {
      const account = ethers.utils.getAddress(accounts[0]);
      setAccount(account);
    } else {
      setAccount(null);
    }
  };
  
  useEffect(() => {
    loadBlockchainData();
  
    // Cleanup function
    return () => {
      if (window.ethereum) {
        window.ethereum.removeListener('accountsChanged', handleAccountsChanged);
      }
    };
  }, []);
  


  return (
    
    <div>
       {showNotice && (
        <div
          style={{
            position: 'fixed',
            bottom: '10px',
            borderRadius: '10px',
            left: '10px',
            width: '400px',
            height: '130px',
            padding: '20px',
            backgroundColor: 'rgb(206,212,218)',
            color: '#62686F',
            fontSize: '16px',
            zIndex: '9999',
          }}
        >
          <p>
            Esto es una versión de prueba, con la red Testnet Sepolia.
          </p>
          <p>
            Puedes añadir monedas gratuitamente a tu billetera MetaMask desde el siguiente enlace: 
            <a href="https://sepoliafaucet.com/" target="_blank" style={{color:'#495057'}} rel="noopener noreferrer"> https://sepoliafaucet.com/</a>
          </p>
          <button
            style={{
              position: 'absolute',
              top: '5px',
              right: '5px',
              background: 'none',
              border: 'none',
              color: '#495057',
              fontSize: '16px',
              cursor: 'pointer',
              padding: '0',
            }}
            onClick={closeNotice}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="14"
              height="14"
              viewBox="0 0 14 14"
              fill="#495057"
              style={{
                verticalAlign: 'middle',
              }}
            >
              <path d="M8.75 7l4.375 4.375-1.375 1.375-4.375-4.375-4.375 4.375-1.375-1.375 4.375-4.375-4.375-4.375 1.375-1.375 4.375 4.375 4.375-4.375 1.375 1.375z" />
            </svg>
          </button>
        </div>
      )}

      <Navigation account={account} setAccount={setAccount} />

      <h2>Élite de Ventas</h2>

      {relojes && clothing && bolsos && (
        <> 
        <Section title={"Selección de ropa"} items={clothing} togglePop={togglePop} />
        <Section title={"Colección de relojes"} items={relojes} togglePop={togglePop} />
        <Section title={"Colección de bolsos"} items={bolsos} togglePop={togglePop} />
        </>
      )}

      {toggle && (
        <Product item={item} provider={provider} account={account} stile={stile} togglePop={togglePop} />
      )}

    </div>
  );
}

export default App;

