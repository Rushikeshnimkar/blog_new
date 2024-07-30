import React, {useEffect} from "react";

interface ReviewCardProps {
  metaData: {
    amount: number;
    current_token_data: {
      cdn_asset_uris: {
        cdn_image_uri: string;
      };
      current_collection: {
        uri: string;
        max_supply: number;
        description: string;
        collection_name: string;
        collection_id: string;
        creator_address: string;
      };
      description: string;
      token_data_id: string;
      token_name: string;
      token_properties: any;
      token_standard: string;
      token_uri: string;
    };
  } | null;
  MyReviews?: boolean;
  // review?: ReviewCreated;
  onReviewDeleted?: () => void;
}

const background = {
  backgroundColor: "#222944",
};

const color = {
  color: "#788AA3",
};

const color2 = {
  color: "#11D9C5",
};

const backgroundbutton = {
  backgroundColor: "#11D9C5",
};

const truncateDescription = (
  description: string,
  maxLength: number
): string => {
  const words = description.split(" ");
  const truncatedWords = words.slice(0, maxLength);
  return truncatedWords.join(" ") + (words.length > maxLength ? "..." : "");
};

const NftdataCard: React.FC<ReviewCardProps> = ({
  metaData,
  MyReviews = false,
  onReviewDeleted,
}) => {
  const [imageSrc, setImageSrc] = React.useState<string | null>(null);
  const [attributes, setAttributes] = React.useState<any>(null);

  // React.useEffect(() => {
  //   if (
  //     metaData &&
  //     metaData.current_token_data &&
  //     metaData.current_token_data.token_uri
  //   ) {
  //     console.log(metaData.current_token_data.token_data_id);
  //     fetch(metaData.current_token_data.token_uri)
  //       .then((response) => response.json())
  //       .then((jsonData: any) => {
  //         // Assuming there's an "image" property in the JSON containing the image URL
  //         const imageUrl = jsonData.image;
  //         setImageSrc(imageUrl);
  //       })
  //       .catch((error) => {
  //         console.error(
  //           `Error fetching token URI (${metaData.current_token_data.token_uri}): ${error}`
  //         );
  //       });
  //   }
  // }, [metaData]);

  useEffect(() => {
    const fetchMetaData = async () => {
    setImageSrc("");
    setAttributes("");
    }
    fetchMetaData();
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

  return (
    <div className="w-full cursor-pointer rounded-3xl" style={{ backgroundColor:'#202333', border: '1px solid #0162FF'}}>
      {/* <Link href={`/reviews/${metaData.domainName.replace(/^https:\/\//, '')}`}> */}
      <div className="w-full h-full rounded-lg p-6">
        <div>
          <div className="flex flex-col">
            <div className="">
              <img
                      alt="alt"
                      src={`${
                        "https://nftstorage.link/ipfs"
                      }/${imageSrc}`}
                      className=""
                    />
                    {/* <img
                      alt="alt"
                      src={`${metaData?.current_token_data.cdn_asset_uris.cdn_image_uri}`}
                      className=""
                    /> */}
            </div>
            <div className="w-full">
              <h3 className="leading-12 mb-2 text-white">
                <div className="lg:flex md:flex justify-between">
                  <div className="text-xl font-semibold mt-4">
                    
                    {
                      metaData.current_token_data.token_name.slice(0, 4) === "ipfs" ? (
                        <div>
                          {metaData.current_token_data.token_name.slice(0, 4)}...{metaData.current_token_data.token_name.slice(-4)}
                        </div>
                      ):(
                        <div>
                        {metaData.current_token_data.token_name}
                        </div>
                      )
                    }
                    
                  </div>
                </div>
              </h3>

              <div className="rounded-xl">
                <div className="text-sm text-white text-start flex mt-2">
                  <div className="">
                    {metaData.current_token_data.description}
                  </div>
                </div>
              </div>

              {attributes && (
                <div className="flex-wrap flex gap-2 text-xs text-white rounded-full px-4 py-2 mt-4" style={{backgroundColor:'#0162FF'}}>
                  <div>Role: {attributes.Role}</div>
                  <div className="ml-4">Agility: {attributes.Agility}</div>
                  <div className="ml-4">Strength: {attributes.Strength}</div>
                  <div>Endurance: {attributes.Endurance}</div>
                  <div className="ml-4">Intelligence: {attributes.Intelligence}</div>
                  </div>
              )}
            </div>
          </div>
        </div>
      </div>
      {/* </Link> */}
    </div>
  );
};

export default NftdataCard;
