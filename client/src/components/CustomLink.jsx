import React from 'react';
import { Link, useLocation, useResolvedPath } from 'react-router-dom';

const CustomLink = ({ to, children, title, isMain, ...props }) => {
  const location = useLocation();
  const resolvedPath = useResolvedPath(to);

  // Normalize pathnames
  const currentPath = location.pathname.replace(/\/$/, '') || '/';
  const targetPath = resolvedPath.pathname.replace(/\/$/, '') || '/';
  const isPathMatch = currentPath === targetPath;

  const currentParams = new URLSearchParams(location.search);
  const targetParams = new URLSearchParams(resolvedPath.search);

  // Extract sort value for target link and active browser URL
  const targetSort = targetParams.get('sort');
  const activeSort = currentParams.get('sort');

  let isActive = false;

  if (isPathMatch) {
    if (targetSort === 'popularity_desc') {
      // 'Games' Link logic:
      // Active if sort is 'popularity_desc', OR if no sort parameter is present at all,
      // OR if an unknown/custom filter parameter is used.
      isActive = !activeSort || activeSort === 'popularity_desc' || !['anticipated_desc', 'release_desc', 'upcoming_asc', 'rating_desc'].includes(activeSort) || currentParams.has('search');
    } else {
      // All other specialized category links (Hyped, New, Upcoming, Best):
      // Active ONLY if their exact sort value matches the current URL
      isActive = activeSort === targetSort && !currentParams.has('search');
    }
  }

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