import { useState } from 'react'
import VideoDecode from './VideoDecode';
import './Barcode.scss';
import ScanSim from "../assets/ScanSim.svg";
import "../dbr";

function Barcode() {
    const [scanError, setScanError] = useState("");
    const [bShowScanner, setBShowScanner] = useState(false);
    const [serialNumber, setSerialNumber] = useState<string>('');
    const [validSerialNumber, setValidSerialNumber] = useState(false);
    const [validateSerialNumber, setValidateSerialNumber] = useState(false);
    const [validateSerialRule, setValidateSerialRule] = useState(/.*/s);

    const setScannedSerialNumber = (scanData: any) => {
        let scannedSerialNumber = scanData.slice(0, 5) + " " + scanData.slice(5);

        setSerialNumber(scannedSerialNumber.replace(/\s/g, ''));
        const pattern = /^((89966 )([0-9]){14})$/
        const result = pattern.test(scannedSerialNumber);
        if (result) {
            setValidSerialNumber(true);
        } else {
            setValidSerialNumber(false);
        }
        setValidateSerialNumber(true);
    }

    const onScanError = (errormsg: string) => {
        console.log('on scan error ', errormsg);
        setScanError(errormsg);
        setBShowScanner(false);
    }

    const onScanStop = () => {
        console.log('on scan stop press');
        setScanError("");
        setBShowScanner(false);
    }

    const onScanStart = () => {
        console.log('on scan press');
        window.scroll({ top: 0, left: 0 });
        setScanError("");
        setBShowScanner(true);
    }

    const handleSerialNumber = (e: any) => {
        let value = e.target.value;
        let newValue = value;

        setSerialNumber(newValue.replace(/\s/g, ''));
        const pattern = /^((89966 )([0-9]){14})$/
        const result = pattern.test(newValue);
        if (result) {
            setValidSerialNumber(true);
        } else {
            setValidSerialNumber(false);
        }
    }


    const focusHandelSerialNumber = () => {
        setValidateSerialRule(/.*/s);
        setValidateSerialNumber(false);
    }

    const focusOutHandelSerialNumber = () => {
        if (serialNumber.length > 6) {
            setValidateSerialRule(/^((89966 )([0-9]){14})$/);

            setValidateSerialNumber(true);
        } else {
            setSerialNumber("");
        }
    }


    return (
        <div className="scan-container">
            <div className='scan-section'>
                <input
                    id="serialNumberInput"
                    className='serialNumber'
                    name='serialNumber'
                    value={serialNumber}
                    placeholder='89966 XXXXXXXXXXXXXX'
                    onChange={handleSerialNumber}
                    maxLength={20}
                    onBlur={focusOutHandelSerialNumber}
                    onFocus={focusHandelSerialNumber}
                />
                <div className={`scan-image`} onClick={onScanStart}>
                    <img src={ScanSim} alt="scan sim" />
                </div>
            </div>
            {bShowScanner && (
                <VideoDecode
                    setScannedSerialNumber={setScannedSerialNumber}
                    onScanError={onScanError}
                    onScanStop={onScanStop}
                />
            )}
            {scanError ? (<div>{scanError}</div>) : <></>}
        </div>
    )
}

export default Barcode