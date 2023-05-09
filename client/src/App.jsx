import { NavBar, Footer, Services, Transactions, Welcome } from "./components";

function App() {
  return (
    <div className="min-h-screen">
      <div className="gradient-bg-welcome flex items-center">
        <NavBar/>
        <Welcome />
      </div>
    <Services />
    <Transactions />
    <Footer />
    </div>
  )
}

export default App
