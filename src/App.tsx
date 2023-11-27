import Barcode from "./components/Barcode";
import { Helmet } from "react-helmet";
import './App.css';

function App() {
    return (
        <div className="container">
            <Helmet>
                <meta
                    http-equiv="Content-Security-Policy"
                    content="worker-src 'self' 'unsafe-eval' 'unsafe-inline' blob:;"
                />
            </Helmet>
            <div className="row">
                <Barcode />
            </div>
        </div>
    )
}

export default App;