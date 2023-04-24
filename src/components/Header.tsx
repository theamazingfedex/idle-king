import React, { useCallback } from 'react';
import './Header.css';
import { useLocalStorage } from '../utils';

function Header() {
  const [username, setUsername] = useLocalStorage('idle-king-username', 'Eisenholz');

  const updateUsername = useCallback(() => {
    const newName = prompt('Who dis?', 'your name');
    setUsername(newName || 'nobody');
  }, []);

  return (
    <header className="App-header">
      <p onClick={updateUsername}>
        User: {username}
      </p>
      <p onClick={() => setUsername('no user')}>log out</p>
      &nbsp;
    </header>
  )
}

export default Header;