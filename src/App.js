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

  const togglePop = (item) => {
    setItem(item)
    toggle ? setToggle(false) : setToggle(true)
  }

  const loadBlockchainData = async () => { 
    // Connect to blockchain
    const provider = new ethers.providers.Web3Provider(window.ethereum)
    setProvider(provider)

    const network = await provider.getNetwork()
    console.log(network)
    // Connect to smart contracts
    const stile = new ethers.Contract( 
      config[network.chainId].stile.address,
      Stile, 
      provider )
      setStile(stile)
    // Load products
      const items = []

    for (var i = 0; i < 9; i++) {
      const item = await stile.items(i + 1)
      items.push(item)
    }
    const relojes = items.filter((item) => item.category === 'relojes')
    const clothing = items.filter((item) => item.category === 'clothing')
    const bolsos = items.filter((item) => item.category === 'bolsos')
    
    setRelojes(relojes)
    setClothing(clothing)
    setBolsos(bolsos)
  }

  useEffect(() => { 
    loadBlockchainData()
  }, [])

  return (
    <div>
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
