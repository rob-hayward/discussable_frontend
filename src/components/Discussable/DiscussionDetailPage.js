import React, { useCallback, useEffect, useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useParams } from 'react-router-dom';
import './DiscussionDetailPage.css';

const DiscussionDetailPage = () => {
    const { discussionId } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [newCommentContent, setNewCommentContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    // Wrap fetchDiscussion in useCallback
    const fetchDiscussion = useCallback(async () => {
        try {
            const response = await axiosInstance.get(`/discussions/${discussionId}/`);
            setDiscussion(response.data.discussion);
            setComments(response.data.comments);
        } catch (error) {
            console.error("Error fetching discussion details:", error);
            setErrorMessage('Error fetching discussion details.');
        }
    }, [discussionId]); // dependency array for useCallback

    useEffect(() => {
        fetchDiscussion();
    }, [fetchDiscussion]); // Now fetchDiscussion is stable and won't change on every render

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

    const showComment = async (commentId) => {
      // Placeholder for potential implementation
      // For now, just re-fetch the discussion details to refresh the comments
      fetchDiscussion();
    };

    return (
        <div className="discussion-detail-container">
            <h2>Discussion Detail Page</h2>
            <div>
                <p>ID: {discussion?.id}</p>
                <p>Subject: {discussion?.subject}</p>
                <p>Category: {discussion?.category}</p>
                <p>Total Votes: {discussion?.total_votes}</p>
                <p>Positive Votes: {discussion?.positive_votes}</p>
                <p>Negative Votes: {discussion?.negative_votes}</p>
                <div>
                    <button onClick={() => handleVote('discussion', discussionId, 1)}>Upvote</button>
                    <button onClick={() => handleVote('discussion', discussionId, -1)}>Downvote</button>
                </div>
            </div>
            <h3>Comments</h3>
            {comments.length > 0 ? (
  comments.map((comment) => (
    <div key={comment.id} className="comment">
      {comment.visibility_status === 'visible' ? (
        <>
          <p>Comment ID: {comment.id}</p>
          <p>Content: {comment.comment_content}</p>
          <p>Positive Votes: {comment.positive_votes}</p>
          <p>Negative Votes: {comment.negative_votes}</p>
          <div>
            <button onClick={() => handleVote('comment', comment.id, 1)}>Upvote</button>
            <button onClick={() => handleVote('comment', comment.id, -1)}>Downvote</button>
          </div>
        </>
      ) : (
        <div className="hidden-content">This comment is hidden. <button onClick={() => showComment(comment.id)}>Show</button></div>
      )}
    </div>
  ))
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




//
// import React, { useEffect, useState } from 'react';
// import axiosInstance from '../../api/axiosConfig';
// import PieChart from '../Visualization/PieChart';
// import { useParams } from 'react-router-dom';
//
// const DiscussionDetailPage = () => {
//     const { discussionId } = useParams();
//     const [discussion, setDiscussion] = useState(null);
//     const [comments, setComments] = useState([]);
//     const [errorMessage, setErrorMessage] = useState('');
//
//     useEffect(() => {
//         const fetchDiscussion = async () => {
//             try {
//                 const response = await axiosInstance.get(`/discussions/${discussionId}`);
//                 setDiscussion(response.data.discussion);
//                 setComments(response.data.comments);
//             } catch (error) {
//                 console.error("Error fetching discussion details:", error);
//                 setErrorMessage('Error fetching discussion details.');
//             }
//         };
//
//         fetchDiscussion();
//     }, [discussionId]);
//
//     return (
//         <div className="discussion-detail-container">
//             {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
//             {discussion && (
//                 <>
//                     <h2>{discussion.subject}</h2>
//                     <p>Category: {discussion.category}</p>
//                     <p>Created by: {discussion.creator.preferredName}</p>
//                     <PieChart votable={discussion} />
//                     {/* Voting and hide/show buttons */}
//                     {/* Discussion initial comment */}
//                     {comments.map((comment, index) => (
//                         <div key={comment.id} className="comment">
//                             <p>{comment.creator.preferredName}: {comment.text}</p>
//                             <PieChart votable={comment} />
//                             {/* Voting and hide/show buttons for each comment */}
//                         </div>
//                     ))}
//                 </>
//             )}
//         </div>
//     );
// };
//
// export default DiscussionDetailPage;
