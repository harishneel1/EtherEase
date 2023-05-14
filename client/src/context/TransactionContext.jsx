import React, {useEffect, useState} from 'react';

import {ethers} from "ethers";

import { contractABI, contractAddress }  from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window; 

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
    console.log({
        provider, 
        signer, 
        transactionContract
    });
}

export const TransactionProvider = ({children}) => {

    const [currentAccount, setCurrentAccount] = useState("");

    const [formData, setFormData] = useState({
        addressTo: "", 
        amount: "", 
        keyword: "", 
        message: ""
    })

    const [transactionCount, setTransactionCount] = useState(localStorage.getItem("transactionCount"));

    const [isLoading, setIsLoading] = useState(false);
    const [transactions, setTransactions] = useState([]);
    const handleChange = (e, name, value) => {


        setFormData((prev) => {
            return {
                ...prev, 
                [name]: value
            }
        })
    }

    const getAllTransactions = async () => {
        try {
            if(!ethereum) return alert("Please install metamask")

            const transactionContract = getEthereumContract();
            const availableTransactions = await transactionContract.getAllTransactions();

            const structuredTransactions = availableTransactions.map(transaction => ({
                addressTo: transaction.receiver, 
                addressFrom: transaction.sender, 
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(), 
                message: transaction.message, 
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
            }))

            structuredTransactions(structuredTransactions);

        } catch(err) {
            console.log(err);
        }
    }

    const checkIfWalletIsConnected = async () => {

        try {
            if(!ethereum) return alert("Please install metamask");
    
            //here we get the metamask connected accounts
            const accounts = await ethereum.request({method: "eth_accounts"});
    
            if(accounts.length) {
                setCurrentAccount(accounts[0]);
    
                //getAllTransactions()
    
            } else {
                console.log("No accounts found");
            }
            console.log(accounts);

        } catch(err) {
            console.log(err);

            throw new Error("No thereium object")
        }

    }

    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");

            const accounts = await ethereum.request({method: "eth_requestAccounts"});

            setCurrentAccount(accounts[0]);


        }catch(err) {
            console.log(err);

            throw new Error("No thereium object")
        }
    }

    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount);

        } catch(err) {
            console.log(err);

            throw new Error("No thereium object")
        }
    }


    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");

            const {addressTo, amount, keyword, message} = formData;

            const transactionContract = getEthereumContract();
            const parsedAmount = ethers.utils.parseEther(amount);

            await ethereum.request({ 
                method: "eth_sendTransaction", 
                params: [{
                    from: currentAccount,
                    to: addressTo, 
                    gas: "0x5248", //2100 GWEI, 
                    value: parsedAmount._hex,  //0.001

                }]
             })
            // here, we get the data from the form

            //to store our transaction

            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);

            console.log(`Loading - ${transactionHash.hash}`)

            await transactionHash.wait();
            setIsLoading(false);

            console.log(`Success - ${transactionContract.hash}`)

            const transactionCount = await transactionContract.getTransactionCount();

            setTransactionCount(transactionCount.toNumber());
        } catch(err) {
            console.log(err);

            throw new Error("No thereium object")
        }
    }


    useEffect(() => {
        checkIfWalletIsConnected();
        checkIfTransactionsExist();
    }, [])

    return (
        <TransactionContext.Provider value = {{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction, transactions, isLoading}}>
            {children}
        </TransactionContext.Provider>
    )
}