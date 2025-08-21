import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

interface VnpayParams {
  vnp_Amount: string | null;
  vnp_BankCode: string | null;
  vnp_BankTranNo: string | null;
  vnp_CardType: string | null;
  vnp_OrderInfo: string | null;
  vnp_PayDate: string | null;
  vnp_ResponseCode: string | null;
  vnp_TmnCode: string | null;
  vnp_TransactionNo: string | null;
  vnp_TransactionStatus: string | null;
  vnp_TxnRef: string | null;
  vnp_SecureHash: string | null;
}

const PaymentReturn: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [params, setParams] = useState<VnpayParams>({
    vnp_Amount: null,
    vnp_BankCode: null,
    vnp_BankTranNo: null,
    vnp_CardType: null,
    vnp_OrderInfo: null,
    vnp_PayDate: null,
    vnp_ResponseCode: null,
    vnp_TmnCode: null,
    vnp_TransactionNo: null,
    vnp_TransactionStatus: null,
    vnp_TxnRef: null,
    vnp_SecureHash: null,
  });

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    setParams({
      vnp_Amount: searchParams.get('vnp_Amount'),
      vnp_BankCode: searchParams.get('vnp_BankCode'),
      vnp_BankTranNo: searchParams.get('vnp_BankTranNo'),
      vnp_CardType: searchParams.get('vnp_CardType'),
      vnp_OrderInfo: searchParams.get('vnp_OrderInfo'),
      vnp_PayDate: searchParams.get('vnp_PayDate'),
      vnp_ResponseCode: searchParams.get('vnp_ResponseCode'),
      vnp_TmnCode: searchParams.get('vnp_TmnCode'),
      vnp_TransactionNo: searchParams.get('vnp_TransactionNo'),
      vnp_TransactionStatus: searchParams.get('vnp_TransactionStatus'),
      vnp_TxnRef: searchParams.get('vnp_TxnRef'),
      vnp_SecureHash: searchParams.get('vnp_SecureHash'),
    });
  }, [location.search]);

  const isSuccess = params.vnp_ResponseCode === '00' && params.vnp_TransactionStatus === '00';

  const formattedAmount = params.vnp_Amount
    ? (parseInt(params.vnp_Amount) / 100).toLocaleString('en-US', {
        style: 'currency',
        currency: 'VND',
      })
    : 'N/A';

  const formattedPayDate = params.vnp_PayDate
    ? new Date(
        `${params.vnp_PayDate.slice(0, 4)}-${params.vnp_PayDate.slice(4, 6)}-${params.vnp_PayDate.slice(6, 8)} ${params.vnp_PayDate.slice(8, 10)}:${params.vnp_PayDate.slice(10, 12)}:${params.vnp_PayDate.slice(12, 14)}`
      ).toLocaleString('en-US')
    : 'N/A';

  const handleBackToHome = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-lg p-8 border border-gray-200">
        <div className="text-center">
          <h2 className={`text-2xl font-bold mb-4 ${isSuccess ? 'text-green-600' : 'text-red-600'}`}>
            {isSuccess ? 'Payment Successful' : 'Payment Failed'}
          </h2>
          <p className="text-gray-600 mb-6">
            {isSuccess
              ? 'Thank you for your payment!'
              : 'An error occurred during the transaction. Please try again.'}
          </p>
        </div>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Order ID:</span>
            <span className="text-gray-900">{params.vnp_TxnRef || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Amount:</span>
            <span className="text-gray-900">{formattedAmount}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Bank:</span>
            <span className="text-gray-900">{params.vnp_BankCode || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Bank Transaction No:</span>
            <span className="text-gray-900">{params.vnp_BankTranNo || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Card Type:</span>
            <span className="text-gray-900">{params.vnp_CardType || 'N/A'}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Payment Time:</span>
            <span className="text-gray-900">{formattedPayDate}</span>
          </div>
          <div className="flex justify-between">
            <span className="font-medium text-gray-600">Order Info:</span>
            <span className="text-gray-900">{params.vnp_OrderInfo ? decodeURIComponent(params.vnp_OrderInfo) : 'N/A'}</span>
          </div>
        </div>
        <div className="mt-8 text-center">
          <button
            onClick={handleBackToHome}
            className="inline-flex items-center px-6 py-2 bg-black text-white text-sm font-medium rounded-md hover:bg-black/70 transition-colors"
          >
            Back to Home
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentReturn;
