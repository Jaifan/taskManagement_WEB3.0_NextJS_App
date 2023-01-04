import {ConnectButton} from "web3uikit"
import {useMoralis} from "react-moralis"

function Header() {
    const {isWeb3Enabled} = useMoralis()
    return (
        <nav>
             <h1 className="text-3xl font-bold">Decentralized Task Manager Application</h1>
             <div className={`p-6 flex flex-col items-center ${isWeb3Enabled? "mt-5": "mt-40" }`}>
                <ConnectButton moralisAuth={true}/>
             </div>
        </nav>
    )
}

export default Header;