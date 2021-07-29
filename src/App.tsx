import React from 'react';
import Nav from './ui/layout/Nav';
import Main from './ui/layout/Main';

import './ui/stylesheets/app.css';

const App: React.FC = () => {
    return (
        <div className="App">
            <Nav />
            <Main />
        </div>
    );
};

export default App;
