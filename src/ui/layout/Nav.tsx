import * as React from 'react';
import NavLink from '../components/NavLink';

const Nav: React.FC = () => {
    return (
        <nav className="text-white h-16 px-2 bg-purple-400 flex flex-row flex-wrap items-center justify-between">
            <a className="navbar-brand" href="/">inquirED</a>
            <ul className="list-none text-white flex flex-row px-0 my-0 items-center">
                <NavLink>Admin Panel</NavLink>
                <NavLink>Unit Dashboard</NavLink>
                <NavLink>Curriculum Library</NavLink>
                <NavLink>PD & Learning</NavLink>
                <NavLink>Help</NavLink>
                <NavLink>
                    Admin
                    <div className="ml-2 w-8 h-8 rounded-full border bg-gradient-to-tr font-sans font-medium text-lg inline-flex flex-col justify-center items-center cursor-pointer from-green-200 to-green-100 text-green-400 border-green-200 hover:from-green-300 hover:to-green-200 hover:text-green-500 hover:border-green-300">
                        A
                    </div>
                </NavLink>
            </ul>
        </nav>
    );
};

export default Nav;
