import {ConnectButton} from "web3uikit"

function Header() {
    return (
        <nav>
             <h1>Decentralized Task Manager Application</h1>
             <div>
                <ConnectButton moralisAuth={true}/>
             </div>
        </nav>
    )
}

export default Header;