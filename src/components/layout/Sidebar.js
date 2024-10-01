import { useState } from 'react';
import {
  AiOutlineDashboard,
  AiOutlineUser,
  AiOutlineShoppingCart,
  AiOutlineMail,
  AiOutlineSetting,
  AiOutlineMenu
} from 'react-icons/ai';
import { FiLogOut } from 'react-icons/fi';
import Link from 'next/link';
import { logout } from '@/services/authService';
import useAuth from '@/hooks/useAuth';
import Image from 'next/image';

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(false); //sidebar visibility
  const { user, setUser } = useAuth();

  const handleLogout = async () => {
    try {
      await logout();
      setUser(null);
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };
  // Function to close the sidebar on outside click
  const handleCloseSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile sidebar toggle button */}
      <button
        onClick={() => setIsOpen(true)} // Toggle sidebar visibility
        type="button"
        className="inline-flex items-center p-2 mt-2 ml-3 text-sm text-gray-500 rounded-lg sm:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600"
      >
        <AiOutlineMenu className="w-6 h-6" />
        <span className="sr-only">Open sidebar</span>
      </button>

      {/* Sidebar for both desktop and mobile */}
      <aside
        className={`fixed top-0 left-0 z-40 w-64 h-screen bg-white dark:bg-gray-800 transition-transform duration-300 transform ${
          isOpen ? 'translate-x-0' : '-translate-x-full' // Transition for mobile
        } sm:translate-x-0`} // Always open on desktop
        aria-label="Sidebar"
      >
        <div className="h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800">
          <button
            onClick={handleCloseSidebar} // Close button for mobile
            className="sm:hidden text-gray-500 hover:text-gray-700 focus:outline-none"
          >
            <span className="sr-only">Close sidebar</span>
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
          <a href="#" >
         <Image src="/images/logo-bambalouni.webp" width={150} height={150} class="h-20 mb-8" alt="DonBambaloni Logo" />
      </a>
          <ul className="space-y-2 font-medium ">
            <li>
              <Link href="/dashboard">
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <AiOutlineDashboard className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">Dashboard</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/admin/userManagement">
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <AiOutlineUser className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">User Management</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/shops">
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <AiOutlineShoppingCart className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">Shops</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/messages">
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <AiOutlineMail className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">Messages</span>
                </div>
              </Link>
            </li>
            <li>
              <Link href="/settings">
                <div className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group">
                  <AiOutlineSetting className="w-5 h-5 text-gray-500 transition duration-75 dark:text-gray-400 group-hover:text-gray-900 dark:group-hover:text-white" />
                  <span className="ml-3">Settings</span>
                </div>
              </Link>
            </li>
          </ul>
          <button onClick={handleLogout} className="flex items-center p-2 mt-4 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-900 rounded-lg">
            <FiLogOut className="w-5 h-5 mr-3" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Overlay for mobile when the sidebar is open */}
      {isOpen && (
        <div
          onClick={handleCloseSidebar} // Clicking outside closes the sidebar
          className="fixed inset-0 bg-black bg-opacity-50 z-30 sm:hidden"
        ></div>
      )}
    </>
  );
}
