"use client"
import React, { useState, useEffect } from 'react';
import ReviewContainer from '../../components/ReviewContainer';
import { fetchMetadataFromIPFS } from '../../modules/fetch_metadata_from_ipfs';
import Loader from '../../components/Loaderallreviews';
import { NetSepioSDK } from 'netsepio-sdk';

const Page = () => {

  const sdk = new NetSepioSDK();

  const [reviews, setReviews] = useState([]);
  const [metaDataArray, setMetaDataArray] = useState([]);
  const [loading, setLoading] = useState(true);

  const [currentPage, setCurrentPage] = useState(1);
  const [isNextPageDisabled, setNextPageDisabled] = useState(false);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };
  
  const handlePrevPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  useEffect(() => {
    setLoading(true);
    const fetchReviews = async (page) => {

      try {

        const reviewResults = await sdk.getReviews(page);

        console.log("current",reviewResults);

        if (reviewResults) {
          setReviews(reviewResults);
        } else {
          setReviews([]);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      }
    };

    const fetchReviewsData = async () => {
      await fetchReviews(currentPage);
    };
  
    fetchReviewsData().finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    setLoading(true);
    const fetchReviews = async (page) => {

      try {

        const reviewResultsnextpage = await sdk.getReviews(page+1);

        console.log("next", reviewResultsnextpage);
        setNextPageDisabled(false);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        setNextPageDisabled(true);
      }
    };

    const fetchReviewsData = async () => {
      await fetchReviews(currentPage);
    };
  
    fetchReviewsData().finally(() => setLoading(false));
  }, [currentPage]);

  useEffect(() => {
    const fetchMetaData = async () => {
      const metaDataPromises = reviews.map(async (review) => {
        if (review.metaDataUri && review.metaDataUri.startsWith('ipfs://')) {
          const ipfsUrl = `https://nftstorage.link/ipfs/${review.metaDataUri.split('ipfs://')[1]}`;
          const metaData = await fetchMetadataFromIPFS(ipfsUrl, review.id);
          return { transactionHash: review.transactionHash, metaData };
        }
        return null;
      });
  
      const metaDataResults = (await Promise.all(metaDataPromises)).filter((result) => result !== null);
      console.log("metaDataResults",metaDataResults);
      setMetaDataArray(metaDataResults);
    };
  
    if (reviews.length > 0) {
      setLoading(true);
      fetchMetaData().finally(() => setLoading(false));
    }
  }, [reviews]);  



  return (
    <div>
      <div className="px-4 mx-auto max-w-7xl">
  {loading ? (
      <Loader />
    ) : reviews.length == 0 ? (
      <div
      className="w-full text-center py-40"
    >
      <h2 className="text-4xl font-semibold text-white">Upcoming Reviews</h2>
    </div>
    ) : (
      <>
      <h2 className="text-4xl font-semibold text-white ml-10 py-10">All Reviews</h2>
      <ReviewContainer metaDataArray={metaDataArray} reviews={reviews} MyReviews={false}/>
      </>
    )}
    </div>

{ metaDataArray && metaDataArray?.length > 0 && (
    <div className="inline-flex items-center justify-center w-full mt-4">
      <button onClick={handlePrevPage} disabled={currentPage === 1} className='text-white'>
      <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
<path d="M160,220a11.96287,11.96287,0,0,1-8.48535-3.51465l-80-80a12.00062,12.00062,0,0,1,0-16.9707l80-80a12.0001,12.0001,0,0,1,16.9707,16.9707L96.9707,128l71.51465,71.51465A12,12,0,0,1,160,220Z"/>
</svg>
      </button>
      <span className="mx-2 text-white">Page {currentPage}</span>
      <button onClick={handleNextPage} disabled={isNextPageDisabled} className='text-white'>
      <svg fill="currentColor" width="20px" height="20px" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
<path d="M96,220a12,12,0,0,1-8.48535-20.48535L159.0293,128,87.51465,56.48535a12.0001,12.0001,0,0,1,16.9707-16.9707l80,80a12.00062,12.00062,0,0,1,0,16.9707l-80,80A11.96287,11.96287,0,0,1,96,220Z"/>
</svg>
      </button>
    </div>
)}
    </div>
  )
}

export default Page