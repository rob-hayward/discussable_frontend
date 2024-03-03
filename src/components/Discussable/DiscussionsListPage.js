// src/components/Discussable/DiscussionsListPage.js
// src/components/Discussable/DiscussionsListPage.js
import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import PieChart from '../Visualization/PieChart';
import './DiscussionsListPage.css';

const DiscussionsListPage = () => {
    const [discussions, setDiscussions] = useState([]);

    // Fetch discussions
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

    // Function to update the visibility preference of a discussion
    const updateVisibilityPreference = async (discussionId, preference) => {
        try {
            await axiosInstance.post(`/preferences/discussion/${discussionId}/${preference}/`);
            fetchDiscussions();  // Re-fetch to reflect the updated preferences
        } catch (error) {
            console.error(`Error updating visibility preference:`, error);
        }
    };

    return (
        <div className="discussions-list-container">
            <h2>Existing Discussions</h2>
            {discussions.map((discussion) => {
                const isHiddenByUser = discussion.user_preference === 'hide';
                const isHiddenByCommunity = discussion.visibility_status === 'hidden' && discussion.user_preference !== 'show';

                return (
                    <div key={discussion.id} className={`discussion ${isHiddenByCommunity || isHiddenByUser ? 'hidden' : ''}`}>
                        <div className="discussion-content">
                            {(isHiddenByCommunity || isHiddenByUser) ? (
                                <div className="hidden-content">
                                    This discussion is {isHiddenByCommunity ? 'hidden based on community votes' : 'hidden by you'}.
                                    <button onClick={() => updateVisibilityPreference(discussion.id, 'show')}>Show</button>
                                </div>
                            ) : (
                                <>
                                    <p>Category: {discussion.category}</p>
                                    <Link to={`/discussions/${discussion.id}`}>
                                        <h3>Subject: {discussion.subject}</h3>
                                    </Link>
                                    <p>By: {discussion.creator_name}</p>
                                    {/*<p>Total Votes: {discussion.total_votes}</p>*/}
                                    {/*<p>Positive Votes: {discussion.positive_votes}</p>*/}
                                    {/*<p>Negative Votes: {discussion.negative_votes}</p>*/}
                                    <button onClick={() => updateVisibilityPreference(discussion.id, 'hide')}>Hide
                                    </button>
                                </>
                            )}
                        </div>
                        <PieChart word={discussion} />
                    </div>
                );
            })}
        </div>
    );
};

export default DiscussionsListPage;

