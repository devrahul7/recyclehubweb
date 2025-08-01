import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Transactions = () => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState([]);
  const [balance, setBalance] = useState(0);
  const [loading, setLoading] = useState(true);
  const [withdrawalAmount, setWithdrawalAmount] = useState('');
  const [showWithdrawalForm, setShowWithdrawalForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    if (user) {
      fetchBalance();
      fetchTransactions();
    }
  }, [user, filter]);

  const fetchBalance = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/transactions/balance',
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setBalance(response.data.balance);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://localhost:5000/api/transactions/user',
        {
          params: { type: filter !== 'all' ? filter : undefined },
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setTransactions(response.data.transactions || []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
    } finally {
      setLoading(false);
    }
  };

  const submitWithdrawal = async (e) => {
    e.preventDefault();
    if (!withdrawalAmount || isNaN(withdrawalAmount) || parseFloat(withdrawalAmount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    setSubmitting(true);
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/api/transactions/withdrawal',
        { amount: parseFloat(withdrawalAmount) },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      setWithdrawalAmount('');
      setShowWithdrawalForm(false);
      fetchBalance();
      fetchTransactions();
      alert('Withdrawal request submitted successfully');
    } catch (error) {
      console.error('Error submitting withdrawal:', error);
      if (error.response && error.response.data && error.response.data.message) {
        alert(error.response.data.message);
      } else {
        alert('Failed to submit withdrawal request');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getTransactionTypeColor = (type) => {
    switch (type) {
      case 'earning':
        return 'text-green-600';
      case 'bonus':
        return 'text-blue-600';
      case 'penalty':
        return 'text-red-600';
      case 'withdrawal':
        return 'text-orange-600';
      default:
        return 'text-gray-600';
    }
  };

  const getTransactionStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
            Completed
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (!user) {
    return (
      <div className="text-center py-8">
        <p>Please login to view your transactions</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">My Wallet</h2>
          <div className="mt-2 flex items-center">
            <span className="text-gray-600 mr-2">Current Balance:</span>
            <span className="text-2xl font-bold text-green-600">
              ${balance.toFixed(2)}
            </span>
          </div>
        </div>
        <button
          onClick={() => setShowWithdrawalForm(!showWithdrawalForm)}
          className="mt-4 md:mt-0 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Request Withdrawal
        </button>
      </div>

      {showWithdrawalForm && (
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-semibold mb-3">Request Withdrawal</h3>
          <form onSubmit={submitWithdrawal}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Amount ($)</label>
              <input
                type="number"
                value={withdrawalAmount}
                onChange={(e) => setWithdrawalAmount(e.target.value)}
                className="w-full p-2 border rounded"
                placeholder="Enter amount"
                min="1"
                step="0.01"
                required
              />
            </div>
            <div className="flex space-x-2">
              <button
                type="submit"
                disabled={submitting}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
              >
                {submitting ? 'Processing...' : 'Submit Request'}
              </button>
              <button
                type="button"
                onClick={() => setShowWithdrawalForm(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-3">Transaction History</h3>
        <div className="flex space-x-2 mb-4">
          <button
            onClick={() => setFilter('all')}
            className={`px-3 py-1 rounded-full text-sm ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            All
          </button>
          <button
            onClick={() => setFilter('earning')}
            className={`px-3 py-1 rounded-full text-sm ${filter === 'earning' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            Earnings
          </button>
          <button
            onClick={() => setFilter('withdrawal')}
            className={`px-3 py-1 rounded-full text-sm ${filter === 'withdrawal' ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            Withdrawals
          </button>
          <button
            onClick={() => setFilter('bonus')}
            className={`px-3 py-1 rounded-full text-sm ${filter === 'bonus' ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-800'}`}
          >
            Bonuses
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">
            <p>Loading transactions...</p>
          </div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded">
            <p className="text-gray-500">No transactions found</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Amount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Description
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {transactions.map((transaction) => (
                  <tr key={transaction.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(transaction.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`capitalize ${getTransactionTypeColor(transaction.type)}`}>
                        {transaction.type}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <span className={transaction.type === 'withdrawal' ? 'text-red-600' : 'text-green-600'}>
                        {transaction.type === 'withdrawal' ? '-' : '+'}
                        ${parseFloat(transaction.amount).toFixed(2)}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {transaction.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getTransactionStatusBadge(transaction.status)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Transactions;