import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import HistoryModel from '../../../models/HistoryModel';
import { Pagination } from '../../utils/Pagination';
import { SpinnerLoading } from '../../utils/SpinnerLoading';
import { useUser } from '@clerk/clerk-react';
import { supabase } from '../../../supabaseClient';
import axios from 'axios';

export const HistoryPage = () => {
    
    const { isSignedIn,user } = useUser();
    const [isLoadingHistory, setIsLoadingHistory] = useState(true);
    const [httpError, setHttpError] = useState(null);

    // Histories
    const [histories, setHistories] = useState<HistoryModel[]>([]);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);

    const [imageSrc, setImageSrc] = useState<string[]>([]);

  const fetchImage = async () => {
    histories.map(async (history) => {
      const { data } = supabase.storage
        .from("lms")
        .getPublicUrl(history.img!);
      const url = data.publicUrl;
      try {
        const response = await axios.get(url);
        const d = response.data;
        setImageSrc((prev) => [...prev, d]);
      } catch (error) {
        console.error("Error fetching the image:", error);
      }
    });
  };

  fetchImage();

    useEffect(() => {
        const fetchUserHistory = async () => {
            if (isSignedIn) {
                const url = `https://lms-backend-im3n.onrender.com/api/histories/search/findBooksByUserEmail?userEmail=${user?.emailAddresses[0].emailAddress}&page=${currentPage - 1}&size=5`;
                const historyResponse = await fetch(url);
                if (!historyResponse.ok) {
                    throw new Error('Something went wrong!');
                }
                const historyResponseJson = await historyResponse.json();

                setHistories(historyResponseJson._embedded.histories);
                setTotalPages(historyResponseJson.page.totalPages);
            }
            setIsLoadingHistory(false);

        }
        fetchUserHistory().catch((error: any) => {
            setIsLoadingHistory(false);
            setHttpError(error.message);
        })
    }, [currentPage]);


    if (isLoadingHistory) {
        return (
            <SpinnerLoading/>
        );
    }

    if (httpError) {
        return (
            <div className='container m-5'>
                <p>{httpError}</p>
            </div>
        );
    }

    const paginate = (pageNumber: number) => setCurrentPage(pageNumber);
    
    return(
        <div className='mt-2'>
            {histories.length > 0 ? 
            <>
                <h5>Recent History:</h5>

                {histories.map(history => (
                    <div key={history.id}>
                        <div className='card mt-3 shadow p-3 mb-3 bg-body rounded'>
                            <div className='row g-0'>
                                <div className='col-md-2'>
                                    <div className='d-none d-lg-block'>
                                        {imageSrc[history.id - 1] ? 
                                            <img src={imageSrc[history.id - 1]} width='123' height='196' alt='Book' />
                                            :
                                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                                                width='123' height='196' alt='Default'/>
                                        }
                                    </div>
                                    <div className='d-lg-none d-flex justify-content-center align-items-center'>
                                        {imageSrc[history.id - 1] ?
                                            <img src={imageSrc[history.id - 1]} width='123' height='196' alt='Book' />
                                            :
                                            <img src={require('./../../../Images/BooksImages/book-luv2code-1000.png')} 
                                                width='123' height='196' alt='Default'/>
                                        }
                                    </div>
                                </div>
                                <div className='col'>
                                        <div className='card-body'>
                                            <h5 className='card-title'> {history.author} </h5>
                                            <h4>{history.title}</h4>
                                            <p className='card-text'>{history.description}</p>
                                            <hr/>
                                            <p className='card-text'> Checked out on: {history.checkoutDate}</p>
                                            <p className='card-text'> Returned on: {history.returnedDate}</p>
                                        </div>
                                </div>
                            </div>
                        </div>
                        <hr/>
                    </div>
                ))}
            </>
            :
            <>
                <h3 className='mt-3'>Currently no history: </h3>
                <Link className='btn btn-primary' to={'search'}>
                    Search for new book
                </Link>
            </>
        }
            {totalPages > 1 && <Pagination currentPage={currentPage} totalPages={totalPages} paginate={paginate}/>}
        </div>
    );
}