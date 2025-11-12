import React, { useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import { FaBars, FaBuilding } from 'react-icons/fa';

import { useAuth } from './context/AuthContext'

import { BiLogOut, BiBuildings } from 'react-icons/bi';
import { TbBuildingPlus } from "react-icons/tb";
import { RiCoinsFill } from 'react-icons/ri';
import { IoDocumentSharp } from 'react-icons/io5';
import { NavLink } from 'react-router-dom';
import { FaUserPlus, FaThumbsDown, FaUsersCog, FaFileUpload } from 'react-icons/fa';
import { MdDashboard, MdPayments } from 'react-icons/md';

const Layout: React.FC = () => {

  const { logout, user } = useAuth();
  const [menu, setMenu] = useState<boolean>(false);

  const roleLinks: Record<string, { to: string; label: string; icon: JSX.Element; }[]> = {
    superAdmin: [
      { to: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
      { to: '/add-society', label: 'Add Society', icon: <TbBuildingPlus /> },
      { to: '/manage-societies', label: 'Manage Societies', icon: <BiBuildings /> },
    ],
    admin: [
      { to: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
      { to: '/add-members', label: 'Add Members', icon: <FaUserPlus /> },
      { to: '/manage-members', label: 'Manage Members', icon: <FaUsersCog /> },
      { to: '/upload-documents', label: 'Upload Documents', icon: <FaFileUpload /> },
      { to: '/payments', label: 'Payments', icon: <MdPayments /> },
      { to: '/expenses', label: 'Expenses', icon: <RiCoinsFill /> },
    ],
    member: [
      { to: '/dashboard', label: 'Dashboard', icon: <MdDashboard /> },
      { to: '/complaint-form', label: 'Raise Complaint', icon: <FaThumbsDown /> },
      { to: '/my-payments', label: 'My Payments', icon: <MdPayments /> },
      { to: '/documents', label: 'documents', icon: <IoDocumentSharp /> },
    ],
  }

  const links = useMemo(() => {
    if (!user?.role) return [];
    return roleLinks[user.role] || [];
  }, [user?.role]);

  if (!user) return null;

  return (
    <div className="relative h-full lg:min-h-screen bg-bg" style={{ backgroundColor: '#f8faf9' }}>
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header (mobile) */}
        <header className="fixed top-0 left-0 w-full h-16 z-20 px-5 bg-white shadow-md lg:hidden flex items-center justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-sm bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <FaBuilding className="text-white w-4 h-4" />
            </div>
            <div>
              <h1 className="text-lg font-semibold text-slate-900">MaintenancePro</h1>
            </div>
          </div>
          <div>
            <button
              onClick={() => setMenu(true)}
            >
              <FaBars className='text-2xl' />
            </button>
          </div>
        </header>

        {menu &&
          <div onClick={() => setMenu(false)} className='fixed h-screen inset-0 bg-black/30 z-30'></div>
        }
        <div className={`lg:hidden flex flex-col justify-between fixed inset-0 left-0 h-screen bg-card w-64 z-40 transition-all ease-in-out ${menu ? 'translate-x-0' : '-translate-x-full'}`}>
          <ul className='p-2'>
            {links.map((link, index) => (
              <NavLink
                key={index}
                onClick={() => setMenu(false)}
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? 'flex items-center bg-primary text-white text-lg px-4 py-2'
                    : 'flex items-center bg-slate-50 text-lg px-4 py-2'}
              >
                <span className='text-xl font-medium mr-3'>{link.icon}</span>
                <span>{link.label}</span>
              </NavLink>
            ))}
            <div className='mt-1'>
              <button
                onClick={() => logout()}
                className='flex justify-start items-center px-4 py-2 text-lg bg-red-500 text-card w-full'
              >
                <BiLogOut className='text-xl mr-3' />
                <span>Logout</span>
              </button>
            </div>
          </ul>
        </div>

        {/* Main layout */}
        <div className="grid grid-cols-1 lg:grid-cols-4 xl:grid-cols-5 gap-6 items-start lg:h-[calc(100vh-5.5rem)]">
          <aside className="hidden lg:block lg:col-span-1 h-full ">
            <Sidebar />
          </aside>

          <main className="pt-10 lg:pt-0 col-span-1 lg:col-span-3 xl:col-span-4 bg-card h-full overflow-hidden">
            {/* Outlet renders route content */}
            <div className="h-full overflow-y-auto">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </div >
  );
};

export default Layout;
