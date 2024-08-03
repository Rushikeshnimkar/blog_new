// ReviewContainer.tsx
import React from 'react';
import ReviewCard from './ReviewCard';

interface MyReviewContainerProps {
  metaDataArray: any[];
  reviews: any[];
  MyReviews?: boolean;
}

const ReviewContainer: React.FC<MyReviewContainerProps> = ({ metaDataArray, reviews, MyReviews = false }) => {

  const handleReviewDeleted = () => {
    window.location.reload();
  };

  const containerStyle = {
    display: 'grid',
    gap: '2rem',
  };
  
  const getGridTemplateColumns = () => {
    const screenWidth = window.innerWidth;
  
    if (screenWidth >= 1280) {
      return 'repeat(3, minmax(0, 1fr))';
    } else if (screenWidth >= 1024) {
      return 'repeat(3, minmax(0, 1fr))';
    } else if (screenWidth >= 768) {
      return 'repeat(2, minmax(0, 1fr))';
    } else if (screenWidth >= 576) {
      return 'repeat(2, minmax(0, 1fr))'; // Adjust as needed
    } else {
      return 'repeat(1, minmax(0, 1fr))';
    }
  };
  
  const containerWithMediaQuery = {
    gridTemplateColumns: getGridTemplateColumns(),
  };

  const renderNoReviewsFound = () => (
    <div
      className="w-full text-center py-10"
    >
      <h2 className="text-4xl font-semibold text-gray-700">No Reviews Found</h2>
    </div>
  );

  return (
    <>
      <div
        className="container mx-auto py-4 px-10"
      >
        {metaDataArray.length === 0 ? (
          renderNoReviewsFound()
        ) : (
          <div
            className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3"
            style={{ ...containerStyle, ...containerWithMediaQuery }}
          >
            {metaDataArray.map(({ metaData, transactionHash }, index) => {
              const matchingReview = reviews.find(review => review.transactionHash === transactionHash);
              console.log("matchingData",matchingReview);

              if (matchingReview) {
                return (
                  <div key={index} className="flex">
                    <ReviewCard
                      metaData={metaData}
                      reviews={matchingReview}
                      MyReviews={MyReviews}
                      onReviewDeleted={handleReviewDeleted}
                    />
                  </div>
                );
              }
              return null;
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default ReviewContainer;
