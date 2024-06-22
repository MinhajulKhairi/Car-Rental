// File: src/components/UserList.js
import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../services/api'; // Sesuaikan dengan path yang benar

const UserList = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      try {
        const fetchedUsers = await fetchUsers();
        setUsers(fetchedUsers);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    getUsers();
  }, []);

  return (
    <div>
      <h2>Daftar Pengguna</h2>
      <ul>
        {users.map(user => (
          <li key={user.id}>{user.nama}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
