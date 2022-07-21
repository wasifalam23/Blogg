import React from 'react';
import { Link } from 'react-router-dom';
import './MainNavigation.scss';

const MainNavigation = () => {
  return (
    <nav className="main-navigation__container">
      <Link className="main-navigation__logo" to="/">
        Article
      </Link>

      <ul className="main-navigation__links--holder">
        <li className="main-navigation__list--item">
          <Link className="main-navigation__link" to="/">
            Posts
          </Link>
        </li>

        <li className="main-navigation__list--item">
          <Link className="main-navigation__link" to="/">
            My Posts
          </Link>
        </li>

        <li className="main-navigation__list--item">
          <Link className="main-navigation__link" to="/">
            My Profile
          </Link>
        </li>

        <li className="main-navigation__list--item">
          <Link className="main-navigation__link" to="/">
            Logout
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default MainNavigation;
