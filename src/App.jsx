import React from "react";
import Header from "./components/header";
import Balance from "./components/Balance";
import IncomeExpenses from "./components/incomeExpenses";
import Transactionlist from "./components/Transactionlist";
import Addtransaction from "./components/Addtransaction";
import { GlobalProvider } from "./context/GlobalState";
import './App.css'
function App()
{
  


  return(
    <GlobalProvider>
    <Header />
    <div className="container">
      <Balance />
      <IncomeExpenses />
      <Transactionlist />
      <Addtransaction />
    </div>
    </GlobalProvider>
  )
}

export default App;