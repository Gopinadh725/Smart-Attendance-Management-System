import React, { useState } from 'react';
import Navbar from './Navbar';
import Sidebar from './Sidebar';
import { motion } from 'framer-motion';

const MainLayout = ({ children }) => {
    const [isSidebarOpen, setSidebarOpen] = useState(true);

    return (
        <div className="min-h-screen bg-slate-50 dark:bg-black flex transition-colors duration-300">
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
            
            <div className="flex-1 flex flex-col min-w-0">
                <Navbar toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />
                
                <motion.main 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="flex-1 p-6 lg:p-10 overflow-auto"
                >
                    {children}
                </motion.main>
            </div>
        </div>
    );
};

export default MainLayout;
