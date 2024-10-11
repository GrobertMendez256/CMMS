import React, { useState } from 'react';
import Link from 'next/link';


const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
      <button className="toggle-btn" onClick={toggleSidebar}>
        {isOpen ? 'Hide' : 'Show'}
      </button>
      {isOpen && (
        <nav>
          <ul>
            <li>
              <Link href="/">Inicio</Link>
            </li>
            <li>
              <Link href="/word-orders">Ordenes de Trabajo</Link>
            </li>
            <li>
              <Link href="/preventive">Preventivo</Link>
            </li>
            <li>
              <Link href="/parts-and-inventory">Repuestos</Link>
            </li>
            <li>
              <Link href="/my-assets">Vehículos</Link>
            </li>
            <li>
              <Link href="/suppliers">Proveedores</Link>
            </li>
            <li>
              <Link href="/users">Usuarios</Link>
            </li>
          </ul>
        </nav>
      )}
      <style jsx>{`
        .sidebar {
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 250px;
        background-color: #333;
        color: white;
        padding-top: 20px;
        transition: width 0.3s ease;
        overflow: hidden;
        }

        .sidebar.closed {
        width: 50px;
        }

        .sidebar ul {
        list-style-type: none;
        padding: 0;
        }

        .sidebar ul li {
        padding: 15px 10px;
        }

        .sidebar ul li a {
        color: white;
        text-decoration: none;
        display: block;
        }

        .toggle-btn {
        position: absolute;
        top: 10px;
        right: -40px;
        width: 40px;
        height: 40px;
        background-color: #333;
        color: white;
        border: none;
        cursor: pointer;
        }

        .sidebar.closed .toggle-btn {
        right: 0;
        }

      `}</style>
    </div>
    
  );
};

export default Sidebar;
