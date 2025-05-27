import { useEffect, useState } from 'react'
import { getDiscover } from '../services/api'
import React from "react";

const Discover = () => {
  const[users, setUsers] = useState([]);
  const[loading, isLoading] = useState(true);

  useEffect(() => {
    getDiscover()
      .then((res) => {
        if(Array.isArray(res.data)){
          setUsers(res.data);
        }
        else if (res.data && Array.isArray(res.data.users)){
          setUsers(res.data.users);
        }
        else{
          console.error("Received data is not an array or does not contain an array");
          setUsers([]);
        }

        isLoading(false)
      })
      .catch((e) => {
        console.error("Error getting other user profiles:", e);
        isLoading(false)
      });
    }, [])

    if (loading) return <p>Loading users...</p>
    if (users.length === 0) return <p>Users not found.</p>

  return (
    <div>
      <h1>Discover Page</h1>
      <ul>{users.map((user) => (
        <li key={user.id}>
          <span>{user.username}</span>
        </li>
      ))}</ul>
    </div>
  );
};

export default Discover;