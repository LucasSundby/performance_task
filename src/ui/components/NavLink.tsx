import * as React from 'react';

type NavLinkProps = {
    children: React.ReactNode;
};

const NavLink: React.FC<NavLinkProps> = ({children}: NavLinkProps) => (
    <li>
        <a href="#" className="text-white py-6 px-2 uppercase text-lg font-light">
            {children}
        </a>
    </li>
);

export default NavLink;
