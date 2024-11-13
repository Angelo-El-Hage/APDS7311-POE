import React, { useState } from 'react';
import { format } from 'date-fns';
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';

// TypeScript interface for transaction prop
interface Transaction {
  _id: string;
  amount: number;
  currency: string;
  provider: string;
  destinationAccount: string;
  swiftCode: string;
  status: string;
  createdAt: string;
}

interface TransactionCardProps {
  transaction: Transaction;
  onUpdateStatus: (id: string, newStatus: string) => void; // Callback for status update
}

const TransactionCard: React.FC<TransactionCardProps> = ({ transaction, onUpdateStatus }) => {
  const { _id, amount, currency, provider, destinationAccount, swiftCode, status, createdAt } = transaction;
  const formattedDate = format(new Date(createdAt), 'PPP');

  // Local state to manage status selection
  const [currentStatus, setCurrentStatus] = useState<string>(status);

  const handleStatusChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = event.target.value;
    setCurrentStatus(newStatus);
    onUpdateStatus(_id, newStatus); // Call the callback to update status
  };

  return (
    <div className="transaction-card">
      <div className="transaction-header">
        <h3>
          <AccountBalanceIcon /> {provider} Transfer
        </h3>
        <span className={`status ${currentStatus}`}>{currentStatus}</span>
      </div>
      <div className="transaction-details">
        <p><strong>Amount:</strong> {currency} {amount.toLocaleString()}</p>
        <p><strong>Destination Account:</strong> {destinationAccount}</p>
        <p><strong>SWIFT Code:</strong> {swiftCode}</p>
        <p><strong>Date:</strong> {formattedDate}</p>
      </div>
      <div className="transaction-actions">
        <label htmlFor="status">Change Status:</label>
        <select id="status" value={currentStatus} onChange={handleStatusChange}>
          <option value="verified">Verified</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
      </div>
    </div>
  );
};

export default TransactionCard;
