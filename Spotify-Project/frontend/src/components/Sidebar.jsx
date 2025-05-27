import { Link, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { FaChartBar, FaMusic, FaUser, FaCompactDisc, FaEnvelope, FaComments } from 'react-icons/fa';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleStatistics = () => {
    setIsStatisticsOpen(!isStatisticsOpen);
  };

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/">
          {/* Removed img tag for TJLogo. You can add your own logo here if desired. */}
        </Link>
      </div>
      <nav className="sidebar-nav">
        <ul>
          <li>
            <div onClick={toggleStatistics} className={`sidebar-nav-item ${isActive('/liked-songs') || isActive('/top-songs') || isActive('/top-artists') ? 'active' : ''}`} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '12px', padding: '0.75rem 1rem' }}>
              <FaChartBar /> Your Statistics
            </div>
            {isStatisticsOpen && (
              <ul className="dropdown-menu" style={{ listStyle: 'none', paddingLeft: '20px'}}>
                <li>
                  <Link to="/liked-songs" className={isActive('/liked-songs') ? 'active' : ''}>
                    <FaMusic /> Liked Songs
                  </Link>
                </li>
                <li>
                  <Link to="/top-songs" className={isActive('/top-songs') ? 'active' : ''}>
                    <FaUser /> Top Songs
                  </Link>
                </li>
                <li>
                  <Link to="/top-artists" className={isActive('/top-artists') ? 'active' : ''}>
                    <FaCompactDisc /> Top Artists
                  </Link>
                </li>
              </ul>
            )}
          </li>
          <li>
            <Link to="/discover" className={isActive('/discover') ? 'active' : ''}>
              <FaCompactDisc /> Discover
            </Link>
          </li>
          <li>
            <Link to="/inbox" className={isActive('/inbox') ? 'active' : ''}>
              <FaEnvelope /> Inbox
            </Link>
          </li>
          <li>
            <Link to="/forums" className={isActive('/forums') ? 'active' : ''}>
              <FaComments /> Forums
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;