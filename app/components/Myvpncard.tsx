"use client";
import React, { useState , useEffect} from "react";
import Cookies from "js-cookie";
import QrCode from "./qrCode";
import Link from "next/link";
const EREBRUS_GATEWAY_URL = process.env.NEXT_PUBLIC_EREBRUS_BASE_URL;

interface ReviewCardProps {
  metaData: {
    created_at: string;
    UUID: string;
    name: string;
    region: string;
    walletAddress: number;
  } | null;
  MyReviews?: boolean;
  onReviewDeleted?: () => void;
  onChildValue: (value: string) => void;
}

const color = {
  color: "#788AA3",
};

const backgroundbutton = {
  backgroundColor: "#0162FF",
};

const MyVpnCard: React.FC<ReviewCardProps> = ({
  metaData,
  MyReviews = false,
  onReviewDeleted,
  onChildValue
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [delvpn, setdelvpn] = useState(false);
  const [qr, setqr] = useState(false);
  const [formattedDate, setFormattedDate] = useState('');

  useEffect(() => {
    if (metaData) {
      const date = new Date(metaData.created_at);
      setFormattedDate(date.toLocaleString());
    }
  }, [metaData]);

  
  if (!metaData) {
    return (
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto">
        <div
          className="w-full h-72 p-5 bg-center bg-cover"
          style={{ display: "flex", alignItems: "center" }}
        >
          <div className="animate-spin rounded-full h-32 w-32 mx-auto border-t-2 border-b-2 border-green-200"></div>
        </div>
      </div>
    );
  }

  const deletevpn = async (id: string, region: string) => {
    setLoading(true);

    const auth = Cookies.get("erebrus_token");

    try {
      const response = await fetch(
        `${EREBRUS_GATEWAY_URL}api/v1.0/erebrus/client/${id}`,
        {
          method: "DELETE",
          headers: {
            Accept: "application/json, text/plain, */*",
            "Content-Type": "application/json",
            Authorization: `Bearer ${auth}`,
          },
        }
      );

      console.log(response);

      if (response.status === 200) {
        console.log("success");
        setdelvpn(false);
        onChildValue("refreshdataafterdelete");
      } else {
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full">
      <div
        className="w-full h-full lg:px-10 md:px-10 lg:py-4 md:py-4 p-4 border-t border-gray-500"
        style={{ backgroundColor: "#202333" }}
      >
        <div className="w-full px-4 flex justify-between">
          <div className="text-l leading-12 font-bold mb-2 text-white w-1/4">
            <div className="flex">
              <div>
                {formattedDate}
              </div>
            </div>
          </div>

          <div className="lg:flex md:flex justify-between w-1/4">
            <div>
              <div className="text-lg rounded-lg pr-1 text-white">
                <div>{metaData.name}</div>
              </div>
            </div>
          </div>


          <div className="text-white text-lg w-1/4 btn bg-blue-gray-700 text-center">
            <div className="flex gap-4 justify-center">
                <div>
                  {metaData.region} 
                </div>
                <img src={`https://flagsapi.com/${metaData.region}/shiny/64.png`} className="w-10"/>
            </div>
          </div>

          <div className="flex gap-4 w-1/4 justify-end">
          
            <button
              className="text-lg rounded-lg"
              onClick={() => setdelvpn(true)}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
      {qr && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative lg:w-1/3 w-full max-w-2xl max-h-full">
            <div
              className="relative rounded-lg shadow dark:bg-gray-700 p-6"
              style={{ backgroundColor: "#445088" }}
            >
              <div className="p-4 md:p-5 flex">
                <p className="text-2xl text-center text-white">Scan QR Code</p>
                <button
                  onClick={() => setqr(false)}
                  type="button"
                  className="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 ms-auto inline-flex justify-center items-center dark:hover:bg-gray-600 dark:hover:text-white"
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
              <QrCode
                clientId={metaData.UUID}
                name={metaData.name}
                region={metaData.region}
              />
              <div className="text-gray-300 mb-4">
                On your mobile, open the WireGuard app, and use the option to
                add a new connection by scanning a QR code. After scanning, the
                app will import the configuration. You can then connect to
                Erebrus VPN through the WireGuard app.
              </div>
              <Link
                href="https://www.wireguard.com/"
                target="_blank"
                className="text-green-500 font-bold px-4 rounded-lg pb-2 pt-1"
                style={{ border: "1px solid white" }}
              >
                Wireguard
              </Link>
            </div>
          </div>
        </div>
      )}

      {delvpn && (
        <div
          style={{ backgroundColor: "#222944E5" }}
          className="flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full"
          id="popupmodal"
        >
          <div className="relative lg:w-1/3 w-full max-w-2xl max-h-full">
            <div
              className="relative rounded-3xl shadow dark:bg-gray-700 p-16 md:p-20"
              style={{ backgroundColor: "#202333", border: "1px solid #0162FF"}}
            >
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-4xl text-center text-white font-bold">
                  Are you sure?
                </p>
              </div>
              <div className="p-4 md:p-5 space-y-4">
                <p className="text-md text-center" style={color}>
                  Do you really want to delete this client? This process can not
                  be undone.
                </p>
              </div>
              <div className="flex items-center p-4 md:p-5 rounded-b gap-4">
                <button
                  style={{ border: "1px solid #5696FF"}}
                  onClick={() => setdelvpn(false)}
                  type="button"
                  className="w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Cancel
                </button>
                <button
                  style={backgroundbutton}
                  onClick={() => deletevpn(metaData.UUID, metaData.region)}
                  type="button"
                  className="w-full text-white font-bold focus:ring-4 focus:outline-none focus:ring-blue-300 rounded-full text-md px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div
        style={{ backgroundColor: "#040819D9" }}
        className='flex overflow-y-auto overflow-x-hidden fixed inset-0 z-50 justify-center items-center w-full max-h-full'
        id='popupmodal'
      >
        <div className='relative p-4 lg:w-1/5 w-full max-w-2xl max-h-full'>
          <div className='relative rounded-lg shadow'>
            <div className='flex justify-center gap-4'>
              <img
                className='w-32 animate-spin duration-[3000] h-12'
                src='https://media0.giphy.com/media/2WjpfxAI5MvC9Nl8U7/giphy.gif?cid=6c09b952yjcdy937xonpl4ko7lu4jlboivab0vjnx3cu2av0&ep=v1_internal_gif_by_id&rid=giphy.gif&ct=g'
                alt='Loading icon'
              />
  
              <span className='text-white mt-2'>Loading...</span>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  );
};

export default MyVpnCard;
