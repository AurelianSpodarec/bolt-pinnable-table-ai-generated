import React from 'react';
import { useAuthStore } from '../store/authStore';

export function Dashboard() {
  const { user } = useAuthStore();

  return (
    <div className="p-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">
          Welcome back, {user?.email}
        </h2>
        <p className="text-gray-600">
          This is your dashboard. Start customizing it according to your needs.
        </p>
      </div>
    </div>
  );
}