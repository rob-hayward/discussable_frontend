// src/components/Discussable/DiscussionsListPage.js

import React, { useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { Link } from 'react-router-dom';
import PieChart from '../Visualization/PieChart';
import './DiscussionsListPage.css';

const DiscussionsListPage = () => {
    const [discussions, setDiscussions] = useState([]);
    const [sort, setSort] = useState('newest');

    // Fetch discussions with selected sorting
    const fetchDiscussions = (sortOption = 'newest') => {
        axiosInstance.get(`/discussions/?sort=${sortOption}`)
            .then(response => {
                setDiscussions(response.data);
            })
            .catch(error => {
                console.error('There was an error fetching the discussions', error);
            });
    };

    useEffect(() => {
        fetchDiscussions(sort);
    }, [sort]);

    const handleSortChange = (e) => {
        setSort(e.target.value);
        fetchDiscussions(e.target.value);
    };

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
            <div className="sort-selector">
                <label htmlFor="sort">Sort by:</label>
                <select id="sort" onChange={handleSortChange} value={sort}>
                    <option value="newest">Newest</option>
                    <option value="oldest">Oldest</option>
                    <option value="popularity">Most Popular</option>
                    <option value="total_votes">Total Votes</option>
                </select>
            </div>
            {discussions.map((discussion) => {
                const isHiddenByUser = discussion.user_preference === 'hide';
                const isHiddenByCommunity = discussion.visibility_status === 'hidden' && discussion.user_preference !== 'show';

                return (
                    <div key={discussion.id}
                         className={`discussion ${isHiddenByCommunity || isHiddenByUser ? 'hidden' : ''}`}>
                        <div className="discussion-content">
                            {(isHiddenByCommunity || isHiddenByUser) ? (
                                <div className="hidden-content">
                                    This discussion
                                    is {isHiddenByCommunity ? 'hidden based on community votes' : 'hidden by you'}.
                                    <button className="button"
                                            onClick={() => updateVisibilityPreference(discussion.id, 'show')}>Show</button>
                                </div>
                            ) : (
                                <>
                                    <p>Category: {discussion.category}</p>
                                    <Link to={`/discussions/${discussion.id}`}>
                                        <h3>Subject: {discussion.subject}</h3>
                                    </Link>
                                    <p>By: {discussion.creator_name}</p>
                                    <button className="button"
                                            onClick={() => updateVisibilityPreference(discussion.id, 'hide')}>Hide
                                    </button>
                                </>
                            )}
                        </div>
                        <PieChart word={discussion}/>
                    </div>
                );
            })}
        </div>
    );
};

export default DiscussionsListPage;

