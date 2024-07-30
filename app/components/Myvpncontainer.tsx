// ReviewContainer.tsx
import React from 'react';
import MyVpnCard from './Myvpncard';

interface MyReviewContainerProps {
  metaDataArray: any[];
  MyReviews?: boolean;
  onChildValue: (value: string) => void;
}

const MyVpnContainer: React.FC<MyReviewContainerProps> = ({ metaDataArray, MyReviews = false , onChildValue}) => {

  const handleReviewDeleted = () => {
    window.location.reload();
  };

  const renderNoReviewsFound = () => (
    <div
      className="w-full text-center py-10"
      
    >
      <h2 className="text-4xl font-semibold text-white">No VPN Clients</h2>
    </div>
  );

  return (
    <>
      <div
        className="container mx-auto"
        
      >
        {metaDataArray?.length === 0 ? (
          renderNoReviewsFound()
        ) : (
          <div
            
          >
            {metaDataArray?.map((metaData, index) => (
              <div key={index} className="flex">
                <MyVpnCard
                  metaData={metaData}
                  MyReviews={MyReviews}
                  onReviewDeleted={handleReviewDeleted}
                  onChildValue={onChildValue}
                />
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default MyVpnContainer;