import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { FaChartBar, FaMusic, FaUser, FaCompactDisc, FaEnvelope, FaComments, FaArrowLeft } from 'react-icons/fa';
import { logout } from './AuthContext'
import './Sidebar.css';
import logo from '../assets/logo.png'

const Sidebar = () => {
  const location = useLocation();
  const [isStatisticsOpen, setIsStatisticsOpen] = useState(false);

  const isActive = (path) => {
    return location.pathname === path;
  };

  const toggleStatistics = () => {
    setIsStatisticsOpen(!isStatisticsOpen);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  }

  return (
    <div className="sidebar">
      <div className="logo-container">
        <Link to="/">
          <img src={logo} alt='Heartify Logo' className='sidebar-logo'>
		  </img>
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
		  <li>
			<Link to="/" classNameclassName={isActive('/') ? 'active' : ''}>
			<FaUser /> Profile
			</Link>
		  </li>
          <li>
            <Link to="/" onClick={handleLogout}>
              <FaArrowLeft /> Logout
            </Link>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;