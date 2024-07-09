import React from 'react'
import { Link, useMatch, useResolvedPath } from 'react-router-dom'

const CustomLink = ({ to, children, title, isMain, ...props }) => {

    const resolvedPath = useResolvedPath(to);
    const isActive = useMatch({ path: resolvedPath.pathname, end: true })

    return (
        <li className={`navItem ${isMain ? 'navMainItem' : 'navSubItem'} ${isActive ? 'active' : ''}`}>
            {children}
            <Link className='w-full h-full select-none' to={to} {...props}>
                {title}
            </Link>
        </li>
    )
}

export default CustomLink