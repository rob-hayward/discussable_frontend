import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useParams, useNavigate } from 'react-router-dom';
import PieChart from '../Visualization/PieChart';
import './DiscussionDetailPage.css';
import HideOptionsModal from './HideOptionsModal';


const DiscussionDetailPage = () => {
    const { discussionId } = useParams();
    const navigate = useNavigate();
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false); // State to manage modal visibility
    const [selectedCommentId, setSelectedCommentId] = useState(null);
    const [selectedCreatorId, setSelectedCreatorId] = useState(null);

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

    const handleHideDiscussion = async () => {
      try {
          await updateVisibilityPreference('discussion', discussionId, 'hide');
          navigate('/discussions'); // Adjust the path as necessary for your route setup
      } catch (error) {
          console.error("Error hiding discussion:", error);
      }
  };

    const toggleModal = (commentId = null, creatorId = null) => {
  console.log(`Toggling modal for commentId: ${commentId}, creatorId: ${creatorId}`); // Add this line for debugging
  setSelectedCommentId(commentId);
  setSelectedCreatorId(creatorId);
  setIsModalOpen(!isModalOpen);

  };

    const handleOptionSelect = async (action, id) => {
  console.log(`Action selected: ${action}, ID: ${id}`);

  if (action === 'hideComment') {
    await updateVisibilityPreference('comment', id, 'hide');
  } else if (action === 'hideAllFromUser') {
    // Assuming a separate function or API call to handle blocking a user
    console.log(`Blocking all content from user ID: ${id}`);
    // Implement blocking logic or API call here
  }

  // Re-fetch data to reflect changes
  fetchDiscussion();
  setIsModalOpen(false); // Close the modal
};





    return (
        <div>
            <h2 className="page-title">Discussion Detail Page</h2>
            <div className="discussion-detail-container">
                {discussion && (
                    <div className="discussion-content">

                        <h4>Category: {discussion.category}</h4>
                        <h4>Subject: {discussion.subject}</h4>
                        <p>Discussion by: {discussion.creator_name}</p>
                    </div>
                )}

                {discussion && (
                    <div className="vote-and-chart">
                        <div className="vote-buttons">
                            <button className="button vote"
                                    onClick={() => handleVote('discussion', discussionId, 1)}>Upvote
                            </button>
                            <button className="button vote"
                                    onClick={() => handleVote('discussion', discussionId, -1)}>Downvote
                            </button>
                            <button className="button vote" onClick={handleHideDiscussion}>Hide</button>
                        </div>
                        <div className="pie-chart-container">
                        <PieChart word={discussion}/>
                        </div>
                    </div>
                )}
            </div>

            {comments.length > 0 && comments.map((comment) => {
                const isHiddenByUser = comment.user_preference === 'hide';
                const isHiddenByCommunity = comment.visibility_status === 'hidden' && comment.user_preference !== 'show';

                return (
                    <div key={comment.id}
                         className={`comment-container ${isHiddenByCommunity || isHiddenByUser ? 'hidden' : ''}`}>
                        {(isHiddenByCommunity || isHiddenByUser) ? (
                            <div className="hidden-content">
                                This comment
                                is {isHiddenByCommunity ? 'hidden based on community votes' : 'hidden by you'}.
                                <button className="button vote"
                                        onClick={() => updateVisibilityPreference('comment', comment.id, 'show')}>Show</button>
                            </div>
                        ) : (
                            <div className="comment-content">
                                <p>Comment by: {comment.creator_name}</p>
                                <p>{comment.comment_content}</p>
                            </div>
                        )}
                        <div className="comment-voting">
                            <div className="vote-buttons-comment">
                                <button className="button vote"
                                        onClick={() => handleVote('comment', comment.id, 1)}>Upvote
                                </button>
                                <button className="button vote"
                                        onClick={() => handleVote('comment', comment.id, -1)}>Downvote
                                </button>
                                <button
                                    className="button vote"
                                    onClick={() => toggleModal(comment.id, comment.creator)}
                                >Hide
                                </button>
                            </div>
                            <PieChart word={comment}/>
                        </div>

                        <HideOptionsModal
                          isOpen={isModalOpen}
                          onClose={() => setIsModalOpen(false)}
                          onOptionSelect={handleOptionSelect}
                          selectedCommentId={selectedCommentId}
                          selectedCreatorId={selectedCreatorId}
                        />

                    </div>
                );
            })}

            <div className="new-comment-container">
                <form onSubmit={handleCommentSubmit} className="new-comment-form">
                    <textarea
                        value={newCommentContent}
                        onChange={handleNewCommentChange}
                        placeholder="Add a new comment..."
                        required
                    ></textarea>
                    <button className="button vote" type="submit">Post Comment</button>
                </form>
                {errorMessage && <p className="error-message">{errorMessage}</p>}
            </div>
        </div>
    );
};

export default DiscussionDetailPage;
