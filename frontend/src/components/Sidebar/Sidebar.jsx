import React from 'react';
import './Sidebar.scss';
import { MenuSidebar } from './MenuSidebar';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = ({ Sidebar }) => {
  const location = useLocation();

  return (
    <aside className={Sidebar ? 'sidebar sidebar-open' : 'sidebar'}>
      <h3 className='judul'>BASIS__</h3>
      <ul className='SidebarList'>
        {MenuSidebar.map((item, index) => {
          return (
            <Link key={index} to={item.link}>
              <li
                className='row'
                id={location.pathname === item.link ? 'active' : ''}
              >
                <div id='icon' className='title'>
                  {item.icon}{' '}
                </div>
                <div id='title' className='title'>
                  {item.title}
                </div>
              </li>
            </Link>
          );
        })}
      </ul>
    </aside>
  );
};

export default Sidebar;
