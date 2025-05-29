import { useEffect, useState } from 'react'
import { getDiscover } from '../services/api'
import { useAuth } from '../components/AuthContext';
import { useNavigate } from 'react-router-dom';
import '../styles/Discover.css'
import SquareContainer from '../components/SquareContainer';

const Discover = () => {
  const[users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const[loading, setLoading] = useState(true);
  const { accessToken } = useAuth();
  const navigate = useNavigate();
  

  useEffect(() => {
    if (!accessToken) {
      navigate("/"); // redirect back to login if not authenticated (w access token)
      return;
    }
    console.log("Discover access:" + accessToken)
    const fetchData = async () => {
      try {
        const res = await getDiscover();
        if (Array.isArray(res.data)) {
          setUsers(res.data);
        } else if (res.data && Array.isArray(res.data.users)) {
          setUsers(res.data.users);
        } else {
          console.error("Unexpected format:", res.data);
          setUsers([]);
        }
      } 
      catch (e) {
        console.error("Fetch error:", e);
        setUsers([]);
      } 
      finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [accessToken, navigate]);

  const filteredUsers = users.filter(user =>
    user.profileName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <p>Loading users...</p>;
  if (users.length === 0) return <p>No users found.</p>;

  return (
      <div className="left-aligned-container">
        <div>
          <h1 className="top-header">Discover Page</h1>
        </div>
          <input
            type="text"
            placeholder="Search users by username"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-bar"
          />
        <div>
        </div>
      <SquareContainer type="user" top={filteredUsers}/>
    </div>
  );
};

export default Discover;