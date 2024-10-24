"use client" ; 
import { useState } from "react";
import Add_Trucks from "../../components/company_dashboard/Add_Trucks" ; 
import Manage_Areas from "../../components/company_dashboard/Manage_Areas" ; 
import View_Assigned_Areas from "../../components/company_dashboard/View_Assigned_Areas" ; 
import Trucks_Information from "../../components/company_dashboard/Trucks_Information" ; 
import MissedPickups from "../../components/company_dashboard/Missed_Pickups" ;
const CompanyProfilePage = () => {
  const [selectedOption, setSelectedOption] = useState("manageAreas");

  // Mock data for demonstration
  const trucks = [
    { id: "Truck 101", area: "Area 1", lastService: "2024-09-15", capacity: "80%" },
    { id: "Truck 102", area: "Area 2", lastService: "2024-09-18", capacity: "60%" },
  ];

  // Rendering based on selected option
  const renderContent = () => {
    switch (selectedOption) {
      case "manageAreas":
        return (
         <Manage_Areas />
        );
      case "assignTrucks":
        return (
          <Add_Trucks />
        );
      case "viewAssignedAreas":
        return (
          <View_Assigned_Areas />
        );
      case "truckInformation":
        return (
          <Trucks_Information />
        );
        case "missedPickups":
          return (
            <MissedPickups />
          );        
      default:
        return <p>Select an option to get started.</p>;
    }
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-md p-4">
        <h2 className="text-2xl font-bold mb-6">Company Dashboard</h2>
        <ul>
          <li
            className={`py-2 px-4 mb-2 rounded cursor-pointer ${
              selectedOption === "manageAreas" ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedOption("manageAreas")}
          >
            Manage Areas
          </li>
          <li
            className={`py-2 px-4 mb-2 rounded cursor-pointer ${
              selectedOption === "assignTrucks" ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedOption("assignTrucks")}
          >
            Assign Trucks
          </li>
          <li
            className={`py-2 px-4 mb-2 rounded cursor-pointer ${
              selectedOption === "viewAssignedAreas" ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedOption("viewAssignedAreas")}
          >
            View Assigned Areas
          </li>
          <li
            className={`py-2 px-4 mb-2 rounded cursor-pointer ${
              selectedOption === "truckInformation" ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedOption("truckInformation")}
          >
            Truck Information
          </li>
          <li
            className={`py-2 px-4 mb-2 rounded cursor-pointer ${
              selectedOption === "missedPickups" ? "bg-gray-200" : ""
            }`}
            onClick={() => setSelectedOption("missedPickups")}
          >
            Missed Pickups
          </li>
        </ul>
      </div>

      {/* Main Content */}
      <div className="flex-grow p-6">{renderContent()}</div>
    </div>
  );
};

export default CompanyProfilePage;
