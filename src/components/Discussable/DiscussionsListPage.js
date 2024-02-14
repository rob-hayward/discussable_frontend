import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import './DiscussionsListPage.css';

const DiscussionsListPage = () => {
    const [discussions, setDiscussions] = useState([]);

    // Define fetchDiscussions to be used inside useEffect and showDiscussion
    const fetchDiscussions = () => {
        axiosInstance.get('/discussions/')
            .then(response => {
                setDiscussions(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the discussions', error);
            });
    };

    useEffect(() => {
        fetchDiscussions();
    }, []);

    const showDiscussion = async (discussionId) => {
        // Logic to show discussion if needed, for now, simply re-fetch discussions
        fetchDiscussions();
    };

    return (
        <div className="discussions-list-container">
            <h2>Existing Discussions</h2>
            {discussions.map((discussion) => (
                <div key={discussion.id} className="discussion">
                    {discussion.visibility_status === 'visible' ? (
                        <>
                            <Link to={`/discussions/${discussion.id}`}>
                                <h3>{discussion.subject}</h3>
                            </Link>
                            <p>Category: {discussion.category}</p>
                            <p>Initial Comment: {discussion.comments && discussion.comments.length > 0 ? discussion.comments[0].comment_content : "No initial comment"}</p>
                            <p>Total Votes: {discussion.total_votes}</p>
                            <p>Positive Votes: {discussion.positive_votes}</p>
                            <p>Negative Votes: {discussion.negative_votes}</p>
                            {discussion.comments && discussion.comments.length > 0 && (
                                <>
                                    <p>Initial Comment Positive Votes: {discussion.comments[0].positive_votes}</p>
                                    <p>Initial Comment Negative Votes: {discussion.comments[0].negative_votes}</p>
                                </>
                            )}
                        </>
                    ) : (
                        <div className="hidden-content">
                            This discussion is hidden. <button onClick={() => showDiscussion(discussion.id)}>Show</button>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DiscussionsListPage;
