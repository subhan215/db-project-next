"use client";
import { useState, useEffect } from "react";
import Add_Trucks from "../../components/company_dashboard/Add_Trucks";
import Manage_Areas from "../../components/company_dashboard/Manage_Areas";
import View_Assigned_Areas from "../../components/company_dashboard/View_Assigned_Areas";
import Trucks_Information from "../../components/company_dashboard/Trucks_Information";
import MissedPickups from "../../components/company_dashboard/Missed_Pickups";
import RecyclingCenters from "../../components/company_dashboard/Recycling_Centers";
import AcceptRequests from "../../components/company_dashboard/AcceptRequests";
import Waste_Schedules from "../../components/company_dashboard/Waste_Schedules";
import { setUserData } from "@/store/slices/userDataSlice";
import { useDispatch, useSelector } from "react-redux";
import { setAgreementStatus } from "@/store/slices/agreementStatusSlice";
const CompanyProfilePage = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.userData.value);
  const [selectedOption, setSelectedOption] = useState("manageAreas");
  const [loading, setLoading] = useState(true);
  const [isSigning, setIsSigning] = useState(false);
  const [pendingAgreement, setPendingAgreement] = useState(null);
  const [agreementChecked, setAgreementChecked] = useState(false); // Flag to track agreement check
  let contractStatus =
    useSelector((state) => state.agreementStatus.value) || "active";
  let companyId = userData.user_id;

  useEffect(() => {
    const checkAgreement = async () => {
      try {
        const response = await fetch("/api/company/check-agreement", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ company_id: companyId }),
        });
        const data = await response.json();
        console.log(data)
        if (data.success && data.agreementExists) {
          dispatch(setAgreementStatus("active"));
        } else {
          dispatch(setAgreementStatus("terminated"));
        }
      } catch (error) {
        console.error("Error fetching agreement status:", error);
        dispatch(setAgreementStatus("terminated"));
      } finally {
        setAgreementChecked(true);
      }
    };
  
    if (companyId) {
      checkAgreement();
    }
  }, [companyId, dispatch]);
  
  useEffect(() => {
    const fetchPendingAgreement = async () => {
      try {
        const response = await fetchWithTimeout(
          `/api/company/get_pending_resign_agreement/${companyId}`
        );
        const data = await response.json();
        setPendingAgreement(data.data.length > 0 ? data.data : null);
      } catch (error) {
        console.error("Error fetching pending agreement:", error);
      }
    };
  
    if (companyId) {
      fetchPendingAgreement();
    }
  }, [companyId]);
  
  useEffect(() => {
    if (agreementChecked) {
      setLoading(false);
    }
  }, [agreementChecked]);
  

  useEffect(() => {
    // Set loading to false when both the agreement check and pending agreement fetch are complete
    if (agreementChecked && pendingAgreement !== null) {
      setLoading(false);
    }
  }, [agreementChecked, pendingAgreement]);

  const handleReSignAgreement = async () => {
    setIsSigning(true);
    try {
      const response = await fetch("/api/company/resign-agreement", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ company_id: companyId }),
      });

      const data = await response.json();
      if (data.success) {
        setPendingAgreement(data.data);
      } else {
        console.error("Failed to re-sign the agreement");
      }
    } catch (error) {
      console.error("Error signing agreement:", error);
    } finally {
      setIsSigning(false);
    }
  };

  const renderContent = () => {
    if (contractStatus === "terminated") {
      return (
        <div>
          <p>
            Your contract has been terminated. Please sign the agreement again.
          </p>
          {pendingAgreement ? (
            <div>
              <h4>Your resign agreement request is pending!</h4>
            </div>
          ) : (
            <button
              onClick={handleReSignAgreement}
              disabled={isSigning}
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded"
            >
              {isSigning ? "Signing..." : "Re-sign Agreement"}
            </button>
          )}
        </div>
      );
    }

    switch (selectedOption) {
      case "assignTrucks":
        return <Add_Trucks />;
      case "viewAssignedAreas":
        return <View_Assigned_Areas />;
      case "truckInformation":
        return <Trucks_Information />;
      case "missedPickups":
        return <MissedPickups />;
      case "recyclingCenters":
        return <RecyclingCenters />;
      case "requests":
        return <AcceptRequests />;
      case "waste_schedules":
        return <Waste_Schedules />;
      default:
        return <p>Select an option to get started.</p>;
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-slate-200">
      <div className="w-64 bg-white shadow-md p-0 border-2 ">
        <h2 className="text-2xl font-bold mb-6 pt-2">Company Dashboard</h2>
        {contractStatus === "active" && (
          <ul>
            <li
              className={` flex items-center py-2 px-4 mb-2 cursor-pointer ${
                selectedOption === "assignTrucks"
                  ? "bg-custom-green text-custom-black "
                  : ""
              }`}
              onClick={() => setSelectedOption("assignTrucks")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M8.25 18.75a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 0 1-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 0 1-3 0m3 0a1.5 1.5 0 0 0-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 0 0-3.213-9.193 2.056 2.056 0 0 0-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 0 0-10.026 0 1.106 1.106 0 0 0-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12"
                />
              </svg>
              &nbsp;
              Assign Trucks
            </li>
            <li
              className={`flex items-center py-2 px-4 mb-2 cursor-pointer ${
                selectedOption === "viewAssignedAreas"
                  ? "bg-custom-green text-custom-custom-black"
                  : ""
              }`}
              onClick={() => setSelectedOption("viewAssignedAreas")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M7.5 3.75H6A2.25 2.25 0 0 0 3.75 6v1.5M16.5 3.75H18A2.25 2.25 0 0 1 20.25 6v1.5m0 9V18A2.25 2.25 0 0 1 18 20.25h-1.5m-9 0H6A2.25 2.25 0 0 1 3.75 18v-1.5M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
                />
              </svg>
              &nbsp;
              View Assigned Areas
            </li>
            <li
              className={`flex items-center py-2 px-4 mb-2  cursor-pointer ${
                selectedOption === "truckInformation"
                  ? "bg-custom-green text-custom-custom-black"
                  : ""
              }`}
              onClick={() => setSelectedOption("truckInformation")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z"
                />
              </svg>
              &nbsp;
              Truck Information
            </li>
            <li
              className={`flex items-center py-2 px-4 mb-2  cursor-pointer ${
                selectedOption === "missedPickups"
                  ? "bg-custom-green text-custom-custom-black"
                  : ""
              }`}
              onClick={() => setSelectedOption("missedPickups")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M12 9v3.75m0-10.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.75c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.75h-.152c-3.196 0-6.1-1.25-8.25-3.286Zm0 13.036h.008v.008H12v-.008Z"
                />
              </svg>
              &nbsp;
              Missed Pickups
            </li>
            <li
              className={`flex items-center py-2 px-4 mb-2  cursor-pointer ${
                selectedOption === "recyclingCenters"
                  ? "bg-custom-green text-custom-custom-black"
                  : ""
              }`}
              onClick={() => setSelectedOption("recyclingCenters")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m20.893 13.393-1.135-1.135a2.252 2.252 0 0 1-.421-.585l-1.08-2.16a.414.414 0 0 0-.663-.107.827.827 0 0 1-.812.21l-1.273-.363a.89.89 0 0 0-.738 1.595l.587.39c.59.395.674 1.23.172 1.732l-.2.2c-.212.212-.33.498-.33.796v.41c0 .409-.11.809-.32 1.158l-1.315 2.191a2.11 2.11 0 0 1-1.81 1.025 1.055 1.055 0 0 1-1.055-1.055v-1.172c0-.92-.56-1.747-1.414-2.089l-.655-.261a2.25 2.25 0 0 1-1.383-2.46l.007-.042a2.25 2.25 0 0 1 .29-.787l.09-.15a2.25 2.25 0 0 1 2.37-1.048l1.178.236a1.125 1.125 0 0 0 1.302-.795l.208-.73a1.125 1.125 0 0 0-.578-1.315l-.665-.332-.091.091a2.25 2.25 0 0 1-1.591.659h-.18c-.249 0-.487.1-.662.274a.931.931 0 0 1-1.458-1.137l1.411-2.353a2.25 2.25 0 0 0 .286-.76m11.928 9.869A9 9 0 0 0 8.965 3.525m11.928 9.868A9 9 0 1 1 8.965 3.525"
                />
              </svg>
              &nbsp;
              Recycling Centers
            </li>
            <li
              className={`flex items-center py-2 px-4 mb-2  cursor-pointer ${
                selectedOption === "requests"
                  ? "bg-custom-green text-custom-custom-black"
                  : ""
              }`}
              onClick={() => setSelectedOption("requests")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m4.5 12.75 6 6 9-13.5"
                />
              </svg>
              &nbsp;
              Accept Requests
            </li>
            <li
              className={`flex items-center py-2 px-4 mb-2  cursor-pointer ${
                selectedOption === "waste_schedules"
                  ? "bg-custom-green text-custom-custom-black"
                  : ""
              }`}
              onClick={() => setSelectedOption("waste_schedules")}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke-width="1.5"
                stroke="currentColor"
                class="size-6"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5m-9-6h.008v.008H12v-.008ZM12 15h.008v.008H12V15Zm0 2.25h.008v.008H12v-.008ZM9.75 15h.008v.008H9.75V15Zm0 2.25h.008v.008H9.75v-.008ZM7.5 15h.008v.008H7.5V15Zm0 2.25h.008v.008H7.5v-.008Zm6.75-4.5h.008v.008h-.008v-.008Zm0 2.25h.008v.008h-.008V15Zm0 2.25h.008v.008h-.008v-.008Zm2.25-4.5h.008v.008H16.5v-.008Zm0 2.25h.008v.008H16.5V15Z"
                />
              </svg>
              &nbsp;
              Waste Schedules
            </li>
          </ul>
        )}
      </div>

      <div className="flex-grow p-6">{renderContent()}</div>
    </div>
  );
};

export default CompanyProfilePage;
