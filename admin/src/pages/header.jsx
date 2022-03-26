import React from "react";

const Header = () => {
const showNavbar = (toggleId, navId, bodyId, headerId) => {
        const toggle = document.getElementById('header-toggle'),
         nav = document.getElementById('nav-bar'),
            bodypd = document.getElementById('body-pd'),
            headerpd = document.getElementById('header')
        // Validate that all variables exist

        // show navbar
        nav.classList.toggle('show')
        // change icon
        toggle.classList.toggle('bx-x')
        // add padding to body
        bodypd.classList.toggle('body-pd')
        // add padding to header
       

    }
    return (
        <>
            <header class="header" id="header" style={{background:"white"}}>
                <div class="header__toggle">
                    <i class='bx bx-menu' id="header-toggle" onClick={showNavbar}></i>
                </div>

                <div class="header__img">

                </div>
            </header>
        </>
    )
}
export default Header;