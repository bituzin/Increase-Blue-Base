const CONTRACT_ADDRESS = "0x78776b0d6185D97Ca9a9A822bf1E192e3B44307f";
const BASE_CHAIN_ID = "0x2105";
const BASESCAN_URL = "https://basescan.org/tx/";

const CONTRACT_ABI = [
    {
        "inputs": [],
        "name": "increment",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
    },
    {
        "inputs": [],
        "name": "getCount",
        "outputs": [
            {
                "internalType": "uint256",
                "name": "",
                "type": "uint256"
            }
        ],
        "stateMutability": "view",
        "type": "function"
    },
    {
        "anonymous": false,
        "inputs": [
            {
                "indexed": false,
                "internalType": "uint256",
                "name": "newCount",
                "type": "uint256"
            },
            {
                "indexed": false,
                "internalType": "address",
                "name": "increasedBy",
                "type": "address"
            }
        ],
        "name": "CounterIncreased",
        "type": "event"
    }
];

let web3;
let contract;
let isConnected = false;
let walletAddress = '';
let lastTransactionHash = '';

const connectButton = document.getElementById('connectButton');
const increaseButton = document.getElementById('increaseButton');
const counterDisplay = document.getElementById('counterValue');
const walletInfo = document.getElementById('walletInfo');
const walletAddressSpan = document.getElementById('walletAddress');
const statusDiv = document.getElementById('status');
const contractAddressSpan = document.getElementById('contractAddress');
const networkModal = document.getElementById('networkModal');
const switchNetworkBtn = document.getElementById('switchNetworkBtn');
const lastTxLink = document.getElementById('lastTxLink');
const successModal = document.getElementById('successModal');
const closeSuccessModal = document.getElementById('closeSuccessModal');

contractAddressSpan.textContent = CONTRACT_ADDRESS;

function updateLastTxLink(txHash) {
    if (txHash) {
        lastTxLink.href = `${BASESCAN_URL}${txHash}`;
        lastTxLink.style.display = 'block';
        lastTxLink.textContent = 'View your transaction on Basescan';
    } else {
        lastTxLink.style.display = 'none';
    }
}

function showSuccessModal() {
    successModal.style.display = 'flex';
}

async function checkNetwork() {
    if (window.ethereum) {
        try {
            const chainId = await window.ethereum.request({ method: 'eth_chainId' });
            if (chainId === BASE_CHAIN_ID) {
                networkModal.style.display = 'none';
                return true;
            } else {
                networkModal.style.display = 'flex';
                return false;
            }
        } catch (error) {
            return false;
        }
    }
    return false;
}

async function switchToBaseNetwork() {
    if (!window.ethereum) return;
    
    try {
        await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: BASE_CHAIN_ID }],
        });
        setTimeout(checkNetwork, 1000);
    } catch (switchError) {
        if (switchError.code === 4902) {
            try {
                await window.ethereum.request({
                    method: 'wallet_addEthereumChain',
                    params: [{
                        chainId: BASE_CHAIN_ID,
                        chainName: "Base Mainnet",
                        nativeCurrency: { name: "ETH", symbol: "ETH", decimals: 18 },
                        rpcUrls: ["https://mainnet.base.org"],
                        blockExplorerUrls: ["https://basescan.org/"]
                    }],
                });
                setTimeout(checkNetwork, 1000);
            } catch (addError) {
                console.log('Error adding network');
            }
        }
    }
}

function initContract() {
    if (typeof window.ethereum !== 'undefined') {
        web3 = new Web3(window.ethereum);
        contract = new web3.eth.Contract(CONTRACT_ABI, CONTRACT_ADDRESS);
        return true;
    }
    return false;
}

async function loadBlockchainData() {
    if (!contract) return;

    try {
        const counterValue = await contract.methods.getCount().call();
        counterDisplay.textContent = counterValue;
        
    } catch (error) {
        console.error('Error loading blockchain data:', error);
        counterDisplay.textContent = '0';
    }
}

async function connectWallet() {
    try {
        if (typeof window.ethereum === 'undefined') {
            alert('Please install MetaMask or a Base-compatible wallet!');
            return;
        }

        const correctNetwork = await checkNetwork();
        if (!correctNetwork) {
            return;
        }

        if (!initContract()) {
            alert('Error initializing contract');
            return;
        }

        const accounts = await window.ethereum.request({ 
            method: 'eth_requestAccounts' 
        });
        
        walletAddress = accounts[0];
        isConnected = true;

        connectButton.textContent = 'Disconnect';
        increaseButton.disabled = false;
        walletAddressSpan.textContent = `${walletAddress.substring(0, 6)}...${walletAddress.substring(walletAddress.length - 4)}`;
        walletInfo.style.display = 'block';
        statusDiv.textContent = 'Connected to Base Mainnet';
        statusDiv.className = 'status connected';

        await loadBlockchainData();

    } catch (error) {
        console.error('Connection error:', error);
        alert('Failed to connect wallet. Please try again.');
    }
}

async function increaseCounter() {
    if (!isConnected || !contract) {
        alert('Please connect your wallet first');
        return;
    }

    try {
        const correctNetwork = await checkNetwork();
        if (!correctNetwork) {
            return;
        }

        increaseButton.disabled = true;
        increaseButton.textContent = 'Processing...';
        lastTxLink.style.display = 'none';

        const accounts = await web3.eth.getAccounts();
        
        console.log('Sending transaction...');
        
        const transaction = await contract.methods.increment().send({ from: accounts[0] });
        
        console.log('Transaction confirmed:', transaction);
        
        lastTransactionHash = transaction.transactionHash;
        
        await loadBlockchainData();
        
        updateLastTxLink(lastTransactionHash);

        showSuccessModal();

        increaseButton.disabled = false;
        increaseButton.textContent = 'Increase';

    } catch (error) {
        console.error('Transaction error:', error);
        alert('Transaction failed: ' + error.message);
        increaseButton.disabled = false;
        increaseButton.textContent = 'Increase';
        lastTxLink.style.display = 'none';
    }
}

function disconnectWallet() {
    isConnected = false;
    connectButton.textContent = 'Connect Wallet';
    increaseButton.disabled = true;
    walletInfo.style.display = 'none';
    statusDiv.textContent = 'Not Connected';
    statusDiv.className = 'status disconnected';
    counterDisplay.textContent = '0';
    lastTxLink.style.display = 'none';
}

connectButton.addEventListener('click', async () => {
    if (!isConnected) {
        await connectWallet();
    } else {
        disconnectWallet();
    }
});

increaseButton.addEventListener('click', increaseCounter);
switchNetworkBtn.addEventListener('click', switchToBaseNetwork);
closeSuccessModal.addEventListener('click', () => {
    successModal.style.display = 'none';
    loadBlockchainData();
});

if (window.ethereum) {
    checkNetwork();
    
    window.ethereum.request({ method: 'eth_accounts' })
        .then(accounts => {
            if (accounts.length > 0) {
                setTimeout(() => {
                    initContract();
                    connectWallet();
                }, 500);
            }
        });
}
