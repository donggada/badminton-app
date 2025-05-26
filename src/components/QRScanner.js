import React, { useEffect, useState } from 'react';
import { Html5QrcodeScanner } from 'html5-qrcode';

function QRScanner({ onScanSuccess, onClose }) {
  const [scanner, setScanner] = useState(null);

  useEffect(() => {
    const qrScanner = new Html5QrcodeScanner('qr-reader', {
      fps: 10,
      qrbox: { width: 250, height: 250 },
      aspectRatio: 1.0,
    });

    qrScanner.render((decodedText) => {
      try {
        // QR 코드에서 매칭방 ID 추출
        const roomId = decodedText;
        onScanSuccess(roomId);
        qrScanner.clear();
      } catch (error) {
        console.error('QR 코드 인식 실패:', error);
      }
    });

    setScanner(qrScanner);

    return () => {
      if (scanner) {
        scanner.clear();
      }
    };
  }, [onScanSuccess]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">QR 코드 스캔</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div id="qr-reader" className="w-full"></div>
        <p className="text-sm text-gray-500 mt-4 text-center">
          매칭방 QR 코드를 스캔해주세요
        </p>
      </div>
    </div>
  );
}

export default QRScanner; 