import axios from "axios"
import React, { useContext, useState } from "react"
import { Link } from "react-router-dom"
import { myContext } from "../Context"

function Menu({ showMenu, setShowMenu }) {
  function handleX() {
    setShowMenu(false)
  }

  function handleLogout() {
    axios
      .get(`${process.env.REACT_APP_BACKEND_URI}/logout`, {
        withCredentials: true
      })
      .then(res => {
        if (res.data === "logged out") {
          window.location.href = "/"
        }
      })
  }

  return (
    <>
      <div id="menu_background" className={showMenu ? "show" : null} onClick={handleX}></div>
      <div id="menu" className={showMenu ? "show" : null}>
        <div className="x" onClick={handleX} />
        <ul id="menu_top_items">
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/about">About</Link>
          </li>
          <li>
            <span onClick={handleLogout} className="cursor-pointer">
              Logout
            </span>
          </li>
        </ul>
      </div>
    </>
  )
}

function Header() {
  const { userObject } = useContext(myContext)
  const [showMenu, setShowMenu] = useState(false)
  function handleHamburger() {
    setShowMenu(true)
  }
  return (
    <>
      <header>
        <div onClick={handleHamburger} className="hamburger" />
        <div className="username">{userObject.displayName}</div>
      </header>
      <Menu showMenu={showMenu} setShowMenu={setShowMenu} />
    </>
  )
}

export default Header
