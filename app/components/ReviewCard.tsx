import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";

interface ReviewCardProps {
  metaData: {
    name: string;
    description: string;
    category: string;
    image: string;
    domainAddress: string;
    siteUrl: string;
    siteType: string;
    siteTag: string;
    siteSafety: string;
    siteRating: number;
    ipfsUrl: string;
    id: string;
    interaction: {
      status: boolean;
    }
  } | null;
  reviews: {
    name: string;
    voter: string;
    transactionHash: string;
  } | null;
  MyReviews?: boolean;
  // review?: ReviewCreated;
  onReviewDeleted?: () => void;
}

const background = {
  // backgroundColor: '#222944',
  // boxShadow: '0 0 5px rgba(0, 166, 143, 0.5)'
  boxShadow: "10px 10px 10px 0px #000",
};

const color = {
  color: "#11D9C5",
};

const border = {
  border: "1px solid #11D9C580",
};

const backgroundbutton = {
  backgroundColor: "#11D9C5",
};

const ReviewCard: React.FC<ReviewCardProps> = ({
  metaData,
  reviews,
  MyReviews = false,
  onReviewDeleted,
}) => {
  const [showDescription, setShowDescription] = useState(false);

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

  const handleClick = () => {
    setShowDescription(!showDescription);
  };

  const handleDelete = () => {
    if (onReviewDeleted) {
      onReviewDeleted();
    }
  };

  const truncateDescription = (description: string, maxLength: number): string => {
    const words = description.split(' ');
    const truncatedWords = words.slice(0, maxLength);
    return truncatedWords.join(' ') + (words.length > maxLength ? '...' : '');
  };

  return (
    <div className="flex flex-col items-center justify-center w-full mx-auto rounded-2xl" style={border}>
      <div className="w-full h-full bg-center bg-cover py-4">
          <div className="flex flex-col gap-4 p-4">

            <div className="flex gap-2 flex-wrap my-auto pt-2">
              <h3 className="text-md leading-12 mb-2 text-white">
                {reviews?.name ? (
                  <div>{reviews?.name}</div>
                ) : (
                  <div>
                    {reviews?.voter.slice(0, 2)}..{reviews?.voter.slice(-2)}
                  </div>
                )}
              </h3>

              <div className="text-white text-md">reviewed</div>

              <h3 className="text-md leading-12 mb-2" style={color}>
                  <div>{metaData.name}</div>
              </h3>
            </div>

            {metaData.siteRating && (
              <div className="text-white flex gap-2">
                {metaData.siteRating}/10
              </div>
            )}

            <div className="text-white flex">
            <div className="">
  &quot;{truncateDescription(metaData.description, 15)}&quot;
</div>
            </div>
          </div>
        </div>
        <Link href={`https://explorer.aptoslabs.com/txn/${reviews?.transactionHash}/?network=mainnet`} target="_blank">
              <button className="mb-4 mt-6 text-white flex gap-1 py-1 px-2 text-xs rounded-md" style={{backgroundColor:'#11D9C580'}}>
              <div className="pt-1">Review as NFT</div>
              </button>
        </Link>
      </div>
  );
};

export default ReviewCard;
