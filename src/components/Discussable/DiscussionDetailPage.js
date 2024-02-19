//src/components/Discussable/DiscussionDetailPage.js
import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import PieChart from '../Visualization/PieChart';
import './DiscussionDetailPage.css';

const DiscussionDetailPage = () => {
    const { discussionId } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const fetchDiscussion = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/discussions/${discussionId}/`);
            setDiscussion(response.data.discussion);
            setComments(response.data.comments);
        } catch (error) {
            console.error("Error fetching discussion details:", error);
            setErrorMessage('Error fetching discussion details.');
        }
    }, [discussionId]);

    useEffect(() => {
        fetchDiscussion();
    }, [fetchDiscussion]);

    const updateVisibilityPreference = async (votableType, votableId, preference) => {
        try {
            await axiosInstance.post(`/preferences/${votableType}/${votableId}/${preference}/`);
            fetchDiscussion();  // Re-fetch to reflect the updated preferences
        } catch (error) {
            console.error(`Error updating visibility preference:`, error);
        }
    };

    const handleNewCommentChange = (e) => {
        setNewCommentContent(e.target.value);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newCommentContent.trim()) {
            alert("Comment cannot be empty.");
            return;
        }
        try {
            const response = await axiosInstance.post(`/discussions/${discussionId}/comments/create/`, {
                comment_content: newCommentContent,
            });
            setComments([...comments, response.data]);
            setNewCommentContent('');
            fetchDiscussion(); // Refresh comments to reflect user preferences
        } catch (error) {
            console.error("Error submitting comment:", error.response.data);
            setErrorMessage('Failed to submit comment. Please try again.');
        }
    };

    const handleVote = async (votableType, votableId, voteValue) => {
        try {
            await axiosInstance.post(`/vote/${votableType}/${votableId}/`, {
                vote: voteValue,
            });
            fetchDiscussion(); // Use fetchDiscussion here to refresh data
        } catch (error) {
            console.error("Error submitting vote:", error.response.data);
            setErrorMessage('Failed to submit vote. Please try again.');
        }
    };

    return (
        <div className="discussion-detail-container">
            <h2>Discussion Detail Page</h2>
            {discussion && (
                <div>
                    {/*<p>ID: {discussion.id}</p>*/}
                    <p>Category: {discussion.category}</p>
                    <p>Subject: {discussion.subject}</p>
                    <p>By: {discussion.creator_name}</p>
                    {/*<p>Total Votes: {discussion.total_votes}</p>*/}
                    {/*<p>Positive Votes: {discussion.positive_votes}</p>*/}
                    {/*<p>Negative Votes: {discussion.negative_votes}</p>*/}
                    <PieChart word={discussion}/>
                    <div>
                        <button onClick={() => handleVote('discussion', discussionId, 1)}>Upvote</button>
                        <button onClick={() => handleVote('discussion', discussionId, -1)}>Downvote</button>
                    </div>
                </div>
            )}
            <h3>Comments</h3>
            {comments.length > 0 ? (
                comments.map((comment) => {
                    const isHiddenByUser = comment.user_preference === 'hide';
                    const isHiddenByCommunity = comment.visibility_status === 'hidden' && comment.user_preference !== 'show';

                    return (
                        <div key={comment.id} className={`comment ${isHiddenByCommunity || isHiddenByUser ? 'hidden' : ''}`}>
                            {(isHiddenByCommunity || isHiddenByUser) ? (
                                <div className="hidden-content">
                                    This comment is {isHiddenByCommunity ? 'hidden based on community votes' : 'hidden by you'}.
                                    <button onClick={() => updateVisibilityPreference('comment', comment.id, 'show')}>Show</button>
                                </div>
                            ) : (
                                <>
                                    {/*<p>Comment ID: {comment.id}</p>*/}
                                    <p>By: {comment.creator_name}</p>
                                    <p>Content: {comment.comment_content}</p>
                                    {/*<p>Positive Votes: {comment.positive_votes}</p>*/}
                                    {/*<p>Negative Votes: {comment.negative_votes}</p>*/}
                                    <PieChart word={comment}/>
                                    <div>
                                        <button onClick={() => handleVote('comment', comment.id, 1)}>Upvote</button>
                                        <button onClick={() => handleVote('comment', comment.id, -1)}>Downvote</button>
                                        <button
                                            onClick={() => updateVisibilityPreference('comment', comment.id, 'hide')}>Hide
                                        </button>
                                    </div>
                                </>
                            )}
                        </div>
                    );
                })
            ) : (
                <p>No comments yet.</p>
            )}
            <form onSubmit={handleCommentSubmit} className="new-comment-form">
                <textarea
                    value={newCommentContent}
                    onChange={handleNewCommentChange}
                    placeholder="Add a new comment..."
                    required
                ></textarea>
                <button type="submit">Post Comment</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default DiscussionDetailPage;


