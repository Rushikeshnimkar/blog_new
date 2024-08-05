"use client"
import Cookies from "js-cookie";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import MyVpnContainer from "../../components/Myvpncontainer";
import NftdataContainer from "../../components/NftDataContainer";
import QRCode from "qrcode.react";
import { saveAs } from "file-saver";
import { NetSepioSDK } from 'netsepio-sdk';

const Subscription = () => {
  const [loading, setLoading] = useState(false);
  const [buttonset, setbuttonset] = useState(false);
  const [projectsData, setprojectsData] = useState(null);
  const [nftdata, setnftdata] = useState(null);
  const [msg, setMsg] = useState("");
  const [region, setregion] = useState("");
  const [verify, setverify] = useState(false);
  const [collectionsPage, setcollectionsPage] = useState(true);
  const [collectionId, setcollectionId] = useState();
  const [collectionName, setcollectionName] = useState();
  const [collectionImage, setcollectionImage] = useState();
  const [vpnPage, setvpnPage] = useState(false);
  const [valueFromChild2, setValueFromChild2] = useState("");
  const [note, setnote] = useState(true);
  const [trialsubscriptiondata, settrialsubscriptiondata] = useState(null);

  const sdk = new NetSepioSDK();

  const bg = {
    backgroundColor: "#202333",
  };

  const border = {
    backgroundColor: "#202333",
    border: "1px solid #5696FF",
  };

  const button = {
    border: "1px solid #0162FF",
  };

  const text = {
    color: "#788AA3",
  };

  const initialFormData = {
    name: "",
    region: "",
  };
  const [formData, setFormData] = useState(initialFormData);
  const [ConfigFile, setConfigFile] = useState("");
  const [VpnName, setVpnName] = useState("");

  const [regionname, setregionname] = useState("");

  const handleInputChange = (
    e
  ) => {
    const { id, value } = e.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [id]: value,
    }));
  };

  const handleRegionChange = (
    e
  ) => {
    const { id, value } = e.target;
    setregionname(value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setLoading(true);

    const auth = Cookies.get("authToken");
    console.log("clicked");
    try {

      const response = await sdk.createVpnClient(formData.name, formData.region, auth);

      if (response.status === 200) {
        
        setVpnName(response.payload.client.Name);
        setFormData(initialFormData);
        console.log("vpn data", response);

        const configFile = `${response.configFile}`;
        setConfigFile(configFile);
        setverify(true);
        setValueFromChild2("refreshafterclientcreate");
        // } else if(response.status === 400){
        //   setMsg("Cant create more than 3 clients");
      } else {
        setMsg("Failed to create VPN. Try with unique name.");
      }
      // }
    } catch (error) {
      console.error("Error:", error);
      setMsg("Failed to create VPN. Try with unique name.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchProjectsData = async () => {

      const auth = Cookies.get("authToken");

      setLoading(true);
      try {

        const response = await sdk.getClients(auth);

        console.log("vpn decentralized", response);

        if (response.status === 200) {
          // Filter the data based on the domain ID
          const wallet = "6939ad68-ce60-42e7-9749-3a530282f8c5";
          const payload = response.payload;
          const filteredData = payload.filter(
            (item) => item?.userId === wallet
          );
          filteredData.sort(
            (a, b) =>
              new Date(b.created_at).getTime() -
              new Date(a.created_at).getTime()
          );
          setprojectsData(filteredData);
          console.log("decentralized", filteredData);
        }
      } catch (error) {
        console.error("Error fetching profile data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (vpnPage === true) {
      fetchProjectsData();
    }
  }, [collectionsPage, collectionId, region, valueFromChild2]);

  const loggedin = "auth token";
  const wallet = Cookies.get("erebrus_wallet");

  const handleChildValue = (value) => {
    // Callback function to update the state in the parent component
    setValueFromChild2(value);
    console.log("valueFromChild2", value);
  };

  const handleCollectionClick = (
    collection,
    collectionName,
    collectionImage
  ) => {
    setcollectionId(collection);
    setcollectionName(collectionName);
    setcollectionImage(collectionImage);
    setvpnPage(true);
    setcollectionsPage(false);
  };

  const handleTrialClick = () => {
    setvpnPage(true);
    setcollectionsPage(false);
  };

  // -----------------------------------------------to fetch regions from node data-----------------------------------------------

  const [nodesdata, setNodesData] = useState([]);
  const [activeNodesData, setActiveNodesData] = useState([]);
  const [uniqueRegions, setUniqueRegions] = useState([]);

  useEffect(() => {
    const fetchNodesData = async () => {
      try {

        const response = await sdk.getAllVPNs();

        if (response.status === 200) {
          const payload = response.payload;
          setNodesData(payload);
          const filteredNodes = payload.filter(
            (node) =>
              node.status === "active" &&
              node.region !== undefined &&
              node.region !== null &&
              node.region.trim()
          );
          setActiveNodesData(filteredNodes);

          // Extract and store unique regions
          const regions = Array.from(
            new Set(filteredNodes.map((node) => node.region))
          );
          setUniqueRegions(regions);

          console.log("erebrus nodes", payload);
        }
      } catch (error) {
        console.error("Error fetching nodes data:", error);
      } finally {
      }
    };

    fetchNodesData();
  }, []);

  //-----------------------------------------------------------------------------------------------------------------------

  // -------------------------------------------------- check for trial subscription ------------------------------------------------

  useEffect(() => {
    const trialbuycheck = async () => {
      setLoading(true);

      const auth = Cookies.get("authToken");

      try {
        const response = await sdk.getSubscription(auth);

        if (response?.subscription) {
          settrialsubscriptiondata(response);
          console.log("trial subsc response", response);
        }
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setLoading(false);
      }
    };

    trialbuycheck();
  }, []);

  // Extracting day, year, and time from the dateTime string
  const formatDateTime = (dateTime) => {
    const dateObj = new Date(dateTime);
    const day = dateObj.getDate();
    const month = dateObj.toLocaleString("default", { month: "long" });
    const year = dateObj.getFullYear();
    const time = dateObj.toLocaleTimeString();
    return `${day} ${month} ${year} ${time}`;
  };

  const regiondata = [
    { id: "SG", region: "SG" },
    { id: "IN", region: "IN" },
    { id: "US", region: "US" },
    { id: "JP", region: "JP" },
    { id: "CA", region: "CA" },
    { id: "FI", region: "FI" },
    { id: "GB", region: "GB" },
    { id: "AU", region: "AU" },
    // Add more nodes as needed
  ];
  //form
  const [isOpen, setIsOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const handleOptionClick = (option) => {
    setSelectedOption(option); // Ensuring option is an object
    setFormData((prevData) => ({ ...prevData, region: option.id }));
    setIsOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsOpen(!isOpen);
  };

  const generateSerialNumber = (region, index) => {
    const number = (index + 1).toString().padStart(3, "0");
    return `${region}${number}`;
  };

  const sliceNodeId = (nodeId) => {
    return `${nodeId.slice(0, 3)}...${nodeId.slice(-3)}`;
  };

  const sliceWalletAddress = (walletAddress) => {
    return `${walletAddress.slice(0, 3)}...${walletAddress.slice(-3)}`;
  };

  // Log activeNodesData and filtered result
  console.log("Current activeNodesData:", activeNodesData);
  const filteredNodes = activeNodesData.filter(
    (node) => node.region === regionname
  );
  console.log("Filtered nodes based on region:", filteredNodes, regionname);

  if (!loggedin) {
    return (
      <>
        <div className="min-h-screen">
          <img src="/Brazuca_Sitting.png" className="mx-auto p-10" />
          <div className="flex justify-center text-white bg-black font-bold text-3xl text-center">
            Subscribe and Unlock Full Access, <br></br>
            Log In to Get Started
          </div>
        </div>
      </>
    );
  }

  return (
    <div className="py-0 min-h-screen">
      <section className="">
        <div className="px-10 mx-auto">
          <div className="w-full mx-auto text-left md:text-center">
            {collectionsPage === true && (
              <>
                <div className="text-2xl text-white font-semibold text-left ml-4 my-6 border-b border-gray-700 pb-4">
                  Subscription
                </div>
                {!nftdata && !trialsubscriptiondata && !loading && (
                  <div className="mx-auto px-4 min-h-screen">
                    <div className="w-full text-center py-20">
                      <h2 className="text-4xl font-bold text-white">
                        No Subscription
                      </h2>
                      <div className="bg-blue-500 text-white font-bold py-4 px-6 rounded-lg w-1/5 mx-auto my-20">
                        <Link href="/pages/plans">Try our free trial now</Link>
                      </div>
                    </div>
                  </div>
                )}

                {loading && (
                  <div
                    style={{ backgroundColor: "#040819D9" }}
                    className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                    id="popupmodal"
                  >
                    <div className="relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full">
                      <div className="relative rounded-lg shadow">
                        <div className="flex justify-center gap-4">
                          <img
                            className="w-40 h-32"
                            src='/loader.gif'
                            alt="Loading icon"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex gap-10 w-1/2">
                  {nftdata && (
                    <div className="w-1/2">
                      <NftdataContainer
                        metaDataArray={nftdata}
                        MyReviews={false}
                        selectCollection={handleCollectionClick}
                      />
                    </div>
                  )}

                  {trialsubscriptiondata && (
                    <div
                      className="w-1/2 rounded-3xl mt-2 mb-2 relative min-h-96"
                      style={{
                        backgroundColor: "#202333",
                        border: "1px solid #0162FF",
                      }}
                    >
                      <div className="w-full h-full rounded-lg px-6 pt-6">
                        <button onClick={handleTrialClick}>
                          <div className="flex flex-col">
                            <div className="w-full">
                              <h3 className="leading-12 mb-2 text-white">
                                <div className="text-lg font-semibold mt-4 uppercase">
                                  {trialsubscriptiondata.subscription.type}{" "}
                                
                                </div>
                                <div className="lg:flex md:flex justify-between">
                                  <div className="text-md font-semibold mt-4">
                                    Status: {trialsubscriptiondata.status}
                                  </div>
                                  <div className="text-md font-semibold mt-4">
                                    Valid for 30 days
                                  </div>
                                </div>
                              </h3>

                              <div className="rounded-xl">
                                <div className="text-sm text-white text-start mt-2">
                                  <div className="mb-3">
                                    <span className="text-green-500 ">
                                      Start time :
                                    </span>{" "}
                                    {trialsubscriptiondata.subscription
                                      .startTime
                                      ? formatDateTime(
                                          trialsubscriptiondata.subscription
                                            .startTime
                                        )
                                      : "Loading..."}
                                  </div>
                                  <div className="">
                                    <span className="text-red-500 ">
                                      End time :
                                    </span>{" "}
                                    {trialsubscriptiondata.subscription.endTime
                                      ? formatDateTime(
                                          trialsubscriptiondata.subscription
                                            .endTime
                                        )
                                      : "Loading..."}
                                    

                                  </div>
                                </div>
                              </div>

                              <div
                                className="rounded-full px-10 py-2 mb-10 text-white"
                                style={{
                                  backgroundColor: "#0162FF",
                                  position: "absolute",
                                  bottom: 0,
                                  left: 80,
                                }}
                              >
                                Create Clients
                              </div>
                            </div>
                          </div>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}

            {vpnPage === true && (
              <>
                <div className="min-h-screen">
                  <h1 className="border-b border-gray-700 gap-4 pb-4 ml-6 mt-10 text-start text-2xl font-bold leading-none tracking-normal text-gray-100 md:text-2xl md:tracking-tight">
                    <span className="text-white">My VPN Clients</span>
                  </h1>

                  <h1 className="flex justify-between gap-4 mb-8 ml-6 mt-0 text-start text-lg font-semibold leading-none tracking-normal text-gray-100 md:text-xl md:tracking-tight">

                    <div className="text-white mr-40 mt-6">
                      <button
                        style={{ border: "1px solid #0162FF" }}
                        onClick={() => {
                          setcollectionsPage(true);
                          setvpnPage(false);
                        }}
                        className="px-4 py-3 text-xs font-semibold rounded-full w-full"
                      >
                        View Subscriptions
                      </button>
                    </div>
                  </h1>

                  {buttonset && (
                    <>
                      <div
                        style={{ backgroundColor: "#222944E5" }}
                        className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                        id="popupmodal"
                      >
                        <div className="relative p-4 w-full max-w-2xl max-h-full">
                          <div
                            className="relative rounded-3xl shadow dark:bg-gray-700 rounded-3xl mx-auto w-3/4"
                            style={{
                              backgroundColor: "#202333",
                              border: "1px solid #0162FF",
                            }}
                          >
                            <div className="flex items-center justify-end p-4 md:p-5 rounded-t dark:border-gray-600">
                              <button
                                onClick={() => {
                                  setbuttonset(false);
                                }}
                                type="button"
                                className="text-white bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                              >
                                <svg
                                  className="w-3 h-3"
                                  aria-hidden="true"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 14 14"
                                >
                                  <path
                                    stroke="currentColor"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                    stroke-width="2"
                                    d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                  />
                                </svg>
                                <span className="sr-only">Close modal</span>
                              </button>
                            </div>
                            <section className="">
                              <div className="mx-auto max-w-3xl">
                                <div className="w-full mx-auto text-left px-10 pb-10">
                                  <h1 className="text-4xl font-semibold leading-none tracking-normal text-gray-100 md:text-3xl md:tracking-tight">
                                    <span className="text-white text-center">
                                      Create your client
                                    </span>
                                  </h1>

                                  <form
                                    id="myForm"
                                    className="rounded pt-10"
                                    onSubmit={handleSubmit}
                                  >
                                    <div className="mb-10">
                                      <div className="">
                                        <div className="mb-4 w-full">
                                          <input
                                            type="text"
                                            id="name"
                                            className="shadow border border-gray-300 rounded-full w-full py-4 px-6 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                            placeholder="Name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            required
                                          />
                                        </div>

                                        <div className="mb-4 w-full">
                                          <select
                                            id="regionname"
                                            className="shadow border border-gray-300 rounded-full w-full py-4 px-6 text-gray-900 leading-tight focus:outline-none focus:shadow-outline"
                                            value={regionname}
                                            onChange={handleRegionChange}
                                            required
                                          >
                                            <option
                                              className="bg-white text-black"
                                              value=""
                                            >
                                              Select Region
                                            </option>

                                            {regiondata.map((node) => (
                                              <option
                                                key={node.id}
                                                className="bg-white text-black"
                                                value={node.id}
                                              >
                                                {node.region}
                                              </option>
                                            ))}
                                          </select>
                                        </div>

                                        <div className="mb-4 w-full relative text-black">
                                          <div
                                            className="p-4 bg-white border border-gray-300 rounded-full cursor-pointer"
                                            onClick={handleDropdownToggle}
                                          >
                                            {selectedOption
                                              ? sliceNodeId(selectedOption.id)
                                              : "Select Node ID"}
                                          </div>
                                          {isOpen && (
                                            <div className="absolute w-full mt-1 max-h-60 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-lg z-10">
                                              <div className="grid grid-cols-4 p-2 font-bold bg-gray-200">
                                                <div>S.No</div>
                                                <div>Node ID</div>
                                                <div>Wallet Address</div>
                                                <div>Chain</div>
                                              </div>
                                              {activeNodesData
                                                .filter(
                                                  (node) =>
                                                    node.region === regionname
                                                )
                                                .map((option, index) => (
                                                  <div
                                                    key={option.id}
                                                    className="grid grid-cols-4 p-2 cursor-pointer hover:bg-gray-100"
                                                    onClick={() =>
                                                      handleOptionClick(option)
                                                    }
                                                  >
                                                    <div>
                                                      {generateSerialNumber(
                                                        regionname,
                                                        index
                                                      )}
                                                    </div>
                                                    <div>
                                                      {sliceNodeId(option.id)}
                                                    </div>
                                                    <div>
                                                      {sliceWalletAddress(
                                                        option.walletAddress
                                                      )}
                                                    </div>
                                                    <div>
                                                      {option.chainName}
                                                    </div>
                                                  </div>
                                                ))}
                                            </div>
                                          )}
                                        </div>
                                      </div>

                                      <div className="flex-col gap-4 mr-4">
                                        <div className="text-center w-1/2 mt-10 mx-auto">
                                          <div className="mb-4 md:mb-8">
                                            <button
                                              style={{
                                                backgroundColor: "#0162FF",
                                              }}
                                              type="submit"
                                              value="submit"
                                              className="py-3 mb-2 text-md text-white font-semibold rounded-full w-full sm:mb-0 hover:bg-green-200 focus:ring focus:ring-green-300 focus:ring-opacity-80"
                                            >
                                              Create Client
                                            </button>
                                          </div>
                                        </div>
                                        <p className="text-red-500">{msg}</p>
                                      </div>
                                    </div>
                                  </form>
                                </div>
                              </div>
                            </section>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {verify && (
                    <div
                      style={{ backgroundColor: "#040819D9" }}
                      className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                      id="popupmodal"
                    >
                      <div className="relative p-4 w-full max-w-2xl max-h-full">
                        <div
                          className="relative rounded-3xl shadow dark:bg-gray-700 w-3/4 mx-auto"
                          style={{
                            backgroundColor: "#202333",
                            border: "1px solid #0162FF",
                          }}
                        >
                          <div className="py-4 space-y-4 mt-4">
                            <p className="text-3xl text-center font-semibold text-white">
                              Successfully created!
                            </p>

                            <div className="flex w-full flex-col items-center justify-center">
                              <div className="bg-white mx-auto my-4 w-1/2 justify-center flex h-60 rounded-3xl">
                                <div className="mt-4">
                                  <QRCode value={ConfigFile} size={200} />
                                </div>
                              </div>

                              <div className="text-center text-white text-sm w-2/3 mt-2">
                                Open{" "}
                                <Link
                                  href="https://www.wireguard.com/"
                                  target="_blank"
                                  style={{ color: "#5696FF" }}
                                >
                                  WireGaurd
                                </Link>
                                &nbsp;app on mobile, scan the QR code to add a
                                new connection, and instantly connect to Erebrus
                                VPN.
                              </div>

                              <div className="flex gap-4">
                                <button
                                  className="text-md rounded-lg text-white flex btn bg-blue-gray-700"
                                  onClick={() => {
                                    const blob = new Blob([ConfigFile], {
                                      type: "text/plain;charset=utf-8",
                                    });
                                    saveAs(blob, `${VpnName}.conf`);
                                  }}
                                >
                                  <div
                                    className="flex cursor-pointer p-2 rounded-full mt-4 gap-2 px-20"
                                    style={{
                                      backgroundColor: "#0162FF",
                                    }}
                                  >
                                    <div style={{ color: "white" }}>
                                      Download
                                    </div>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center pb-10 rounded-b w-1/2 mx-auto">
                            <button
                              style={button}
                              onClick={() => {
                                setbuttonset(false);
                                setverify(false);
                                setMsg("");
                              }}
                              type="button"
                              className="w-full text-white focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                            >
                              My VPN Clients
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {loading && (
                    <div
                      style={{ backgroundColor: "#040819D9" }}
                      className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                      id="popupmodal"
                    >
                      <div className="relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full">
                        <div className="relative rounded-lg shadow">
                          <div className="flex justify-center gap-4">
                            <img
                              className="w-40 h-32"
                              src='/loader.gif'
                              alt="Loading icon"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {!buttonset && (
                    <>
                      <section className="pb-10 rounded-xl">
                        {
                          loading ? (
                            // <Loader />
                            <div className="min-h-screen"></div>
                          ) : projectsData && projectsData?.length !== 0 ? (
                            // (!dedicatedVpnData ||
                            //   dedicatedVpnData?.length == 0) && (
                            <div className="mx-6 -mt-20">
                              <div className="flex gap-4">
                                <div className="ml-auto text-white">
                                  <button
                                    style={{
                                      // border: "1px solid #11D9C5",
                                      backgroundColor: "#0162FF",
                                    }}
                                    onClick={() => setbuttonset(true)}
                                    className="px-4 py-3 mb-2 text-xs font-semibold rounded-full w-full sm:mb-0"
                                  >
                                    Add More Clients
                                  </button>
                                </div>
                              </div>

                              <div
                                className="w-full h-full rounded-xl mt-10 pb-2"
                                style={bg}
                              >
                                <div className="pt-4 pb-4 flex justify-between">
                                  <div className="ml-8 text-white text-2xl">
                                    My Clients
                                  </div>
                                  <a
                                    href="https://docs.netsepio.com/erebrus/erebrus/setup"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="mr-8 underline"
                                    style={{ color: "#5696FF" }}
                                  >
                                    How to Start Using Erebrus VPN
                                  </a>
                                </div>

                                <div className="w-full flex justify-between px-14 p-4">
                                  <h3 className="text-lg leading-12 w-1/4 text-left">
                                    <div style={text}>Created At</div>
                                  </h3>

                                  <div className="text-start w-1/4">
                                    <div>
                                      <div className="text-lg " style={text}>
                                        Name
                                      </div>
                                    </div>
                                  </div>

                                  <div
                                    className="text-lg text-center w-1/4"
                                    style={text}
                                  >
                                    Region
                                  </div>

                                  {/* <div
                                    className="text-lg text-center w-1/5"
                                    style={text}
                                  >
                                    Logo
                                  </div> */}

                                  <div
                                    className="text-lg flex justify-end w-1/4"
                                    style={text}
                                  >
                                    <p>Actions</p>
                                  </div>
                                </div>
                                <MyVpnContainer
                                  metaDataArray={projectsData}
                                  MyReviews={false}
                                  onChildValue={handleChildValue}
                                />
                              </div>
                              {note && (
                                <div
                                  className="fixed bottom-0 right-0 w-1/4 px-8 pt-4 pb-8 text-left"
                                  style={{ backgroundColor: "#C7DCFF" }}
                                >
                                  <div className="flex items-center justify-end rounded-t dark:border-gray-600">
                                    <button
                                      onClick={() => {
                                        setnote(false);
                                      }}
                                      type="button"
                                      className="text-black bg-transparent hover:bg-gray-800 hover:text-white rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
                                    >
                                      <svg
                                        className="w-3 h-3"
                                        aria-hidden="true"
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 14 14"
                                      >
                                        <path
                                          stroke="currentColor"
                                          stroke-linecap="round"
                                          stroke-linejoin="round"
                                          stroke-width="2"
                                          d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
                                        />
                                      </svg>
                                      <span className="sr-only">
                                        Close modal
                                      </span>
                                    </button>
                                  </div>
                                  <div className="text-lg font-bold">
                                    Quick Reminder
                                  </div>
                                  <div className="text-sm py-4">
                                    Backup your WireGuard VPN config now!
                                    Download or scan the QR code to avoid
                                    re-setup for Erebrus VPN
                                  </div>
                                  <button
                                    className="py-2 px-10 text-white rounded-full"
                                    style={{ backgroundColor: "#0162FF" }}
                                  >
                                    <Link
                                      href="https://www.wireguard.com/"
                                      target="_blank"
                                    >
                                      Download
                                    </Link>
                                  </button>
                                </div>
                              )}
                            </div>
                          ) : (
                            <>
                              <img
                                src="/create.png"
                                className="mx-auto -mt-10"
                              />

                              <div className="p-2 md:p-5 space-y-4">
                                <p className="text-2xl text-center font-semibold text-white">
                                  Ready for Enhanced security? <br></br>
                                  Create Your VPN Client, Start Safe Surfing
                                  Today!
                                </p>
                                <p className="text-md text-center w-full mx-auto">
                                  You have minted your Erebrus NFT, welcome to
                                  an exclusive journey of innovation and
                                  community. To set clients, click button to go
                                  to subscription page.
                                </p>
                                <button
                                  style={{
                                    // border: "1px solid #11D9C5",
                                    backgroundColor: "#0162FF",
                                  }}
                                  onClick={() => setbuttonset(true)}
                                  className="py-4 text-md rounded-full w-1/6 text-white"
                                >
                                  Create Client now
                                </button>
                              </div>
                            </>
                          )
                          // )
                        }

                        {loading && (
                          <div
                            style={{ backgroundColor: "#040819D9" }}
                            className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
                            id="popupmodal"
                          >
                            <div className="relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full">
                              <div className="relative rounded-lg shadow">
                                <div className="flex justify-center gap-4">
                                  <img
                                    className="w-40 h-32"
                                    src='/loader.gif'
                                    alt="Loading icon"
                                  />
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </section>
                    </>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Subscription;
