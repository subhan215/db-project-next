"use client";
import React, { useState, useEffect, useCallback } from "react";
import { FiMenu, FiX } from "react-icons/fi";
import { FaComments } from "react-icons/fa";
import Notifications from "./Notifications";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-solid-svg-icons";
import { useSelector } from "react-redux";
import { useRouter } from "next/navigation";

const ModernNavbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLargeScreen, setIsLargeScreen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const userData = useSelector((state) => state.userData.value) || null;
  const router = useRouter();

  const turnNotificationsToOff = useCallback(() => {
    setShowNotifications(false);
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const handleResize = () => {
    if (window.innerWidth >= 768) {
      setIsOpen(false);
      setIsLargeScreen(true);
    } else {
      setIsLargeScreen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    handleResize();

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <header className="bg-white shadow-md sticky top-0 z-50 border-b border-black">
      <nav className="container mx-auto flex justify-between items-center p-5">
        {/* Logo */}
        <div className="text-2xl font-bold text-custom-green">
          <a href="#">Enviro</a>
        </div>

        {/* Full Navbar for larger screens */}
        <div className="hidden md:flex gap-8 items-center">
          <a href="#" className="text-gray-700 hover:text-custom-green transition">
            Home
          </a>
          <a href="#" className="text-gray-700 hover:text-custom-green transition">
            About Us
          </a>
          <a href="#" className="text-gray-700 hover:text-custom-green transition">
            Services
          </a>
          <a href="#" className="text-gray-700 hover:text-custom-green transition">
            Contact
          </a>

          {userData && (
            <>
              <FontAwesomeIcon
                icon={faBell}
                size="lg"
                className="text-black hover:cursor-pointer"
                onClick={() => setShowNotifications((prev) => !prev)}
                title="View Notifications"
              />
              {showNotifications && (
                <Notifications turnNotificationsToOff={turnNotificationsToOff} />
              )}

              <FaComments
                size={24}
                className="text-black hover:cursor-pointer"
                title="Chat"
                onClick={() => router.push("/chat")}
              />

              <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition">
                Get Started
              </button>
            </>
          )}
        </div>

        {/* Hamburger Menu for mobile screens */}
        <div className="md:hidden flex items-center">
          {userData && (
            <FontAwesomeIcon
              icon={faBell}
              size="lg"
              className="text-black hover:cursor-pointer mr-4"
              onClick={() => setShowNotifications((prev) => !prev)}
              title="View Notifications"
            />
          )}
          <FaComments
            size={24}
            className="text-black hover:cursor-pointer mr-4"
            title="Chat"
            onClick={() => router.push("/chat")}
          />
          <button onClick={toggleMenu} aria-label="Toggle Navigation">
            {isOpen ? (
              <FiX className="text-3xl text-green-600" />
            ) : (
              <FiMenu className="text-3xl text-green-600" />
            )}
          </button>
        </div>
      </nav>

      {/* Mobile Menu Sliding from the Left */}
      <div
        className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transition-transform transform ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        } duration-300 ease-in-out z-40`}
      >
        <div className="flex flex-col p-5 gap-6">
          <a href="#" className="text-gray-700 text-lg hover:text-green-600 transition">
            Home
          </a>
          <a href="#" className="text-gray-700 text-lg hover:text-green-600 transition">
            About Us
          </a>
          <a href="#" className="text-gray-700 text-lg hover:text-green-600 transition">
            Services
          </a>
          <a href="#" className="text-gray-700 text-lg hover:text-green-600 transition">
            Contact
          </a>
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition mt-4">
            Get Started
          </button>
        </div>
      </div>

      {/* Notifications for mobile view */}
      {showNotifications && !isLargeScreen && (
        <div className="absolute top-16 right-4 w-64">
          <Notifications turnNotificationsToOff={turnNotificationsToOff} />
        </div>
      )}
    </header>
  );
};

export default ModernNavbar;
