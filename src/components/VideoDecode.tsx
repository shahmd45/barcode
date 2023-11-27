import { BarcodeReader, BarcodeScanner, TextResult } from "dynamsoft-javascript-barcode";
import { useEffect, useRef } from "react";
import ScanSimClose from "../assets/Close.svg";
import ScanPictogram from "../assets/ScanPictogram.svg";
import "./VideoDecode.scss";

interface VideoDecodeProps {
    setScannedSerialNumber: (data: string) => void;
    onScanError: (errormsg: string) => void;
    onScanStop: () => void;
}

function VideoDecode(props: VideoDecodeProps) {
    const pScanner = useRef(null as null | Promise<BarcodeScanner>);
    const elRef = useRef<HTMLDivElement>(null);
    const { setScannedSerialNumber, onScanError, onScanStop } = props;

    useEffect(() => {

        (async () => {
            try {
                await BarcodeReader.loadWasm();
            } catch (ex: any) {
                onScanError(ex.message);
                console.log(ex.message);
                throw ex;
            }
        })();

        (async () => {
            try {
                const scanner = (await (pScanner.current = BarcodeScanner.createInstance()));
                if (scanner.isContextDestroyed()) return;

                await scanner.setUIElement(elRef.current!);
                if (scanner.isContextDestroyed()) return;

                await scanner.setResolution(parseInt('640'), parseInt('480'));

                scanner.onFrameRead = (results: TextResult[]) => {
                    for (let result of results) {
                        let scanResult = result.barcodeText;
                        const pattern = /^[\d\s]+$/
                        if (pattern.test(scanResult)) {
                            console.log("onFrameRead result > " + scanResult);
                            setScannedSerialNumber(result.barcodeText);
                            onCloseScan();
                        }
                    }
                };

                scanner.onUniqueRead = (txt: string, result: TextResult) => {
                    console.log("onUniqueRead result > " + txt);
                };
                await scanner.open();
            } catch (ex: any) {
                console.log(ex.message);
                onScanError(ex.message);
                throw ex;
            }
        })();

        return () => {
            (async () => {
                if (pScanner.current) {
                    (await pScanner.current).destroyContext();
                    console.log("BarcodeScanner Component Unmount");
                }
            })();
        };
    }, []);

    const onCloseScan = () => {
        onScanStop();
    }

    return (
        <>
            <div ref={elRef} className="component-barcode-scanner">
                <div className="dce-video-container"></div>
                <div className="dce-scanarea">
                    <div className="dce-scanlight"></div>
                </div>
                <div className="dce-btn-close" onClick={onCloseScan}>
                    <img src={ScanSimClose} alt="close scan" />
                </div>
            </div>
            <div className="scanInformation">
                <div>
                    <img className="scanPictogram" src={ScanPictogram} alt="scan pictogram" />
                </div>
                {"Point barcode from sim"}
            </div>
        </>
    )
}

export default VideoDecode;