import React, {useEffect, useState} from 'react';

import {ethers} from "ethers";

import { contractABI, contractAddress }  from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window; 

const getEthereumContract = () => {
    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    console.log({
        provider, 
        signer, 
        transactionContract
    });
}

export const TransactionProvider = ({children}) => {

    const [currentAccount, setCurrectAccount] = useState("");

    const [formData, setFormData] = useState({
        addressTo: "", 
        amount: "", 
        keyword: "", 
        message: ""
    })

    const handleChange = (e) => {
        setFormData((prev) => {
            return {
                ...prev, 
                [e.target.name]: e.target.value
            }
        })
    }

    const checkIfWalletIsConnected = async () => {

        try {
            if(!ethereum) return alert("Please install metamask");
    
            //here we get the metamask connected accounts
            const accounts = await ethereum.request({method: "eth_accounts"});
    
            if(accounts.length) {
                setCurrectAccount(accounts[0]);
    
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

            setCurrectAccount(accounts[0]);


        }catch(err) {
            console.log(err);

            throw new Error("No thereium object")
        }
    }


    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");


        } catch(err) {
            console.log(err);

            throw new Error("No thereium object")
        }
    }




    useEffect(() => {
        checkIfWalletIsConnected();
    }, [])

    return (
        <TransactionContext.Provider value = {{connectWallet, currentAccount, formData, setFormData, handleChange, sendTransaction}}>
            {children}
        </TransactionContext.Provider>
    )
}