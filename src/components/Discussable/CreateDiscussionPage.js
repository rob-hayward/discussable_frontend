// src/components/Discussable/CreateDiscussionPage.js

import React, { useState } from 'react';
import axiosInstance from '../../api/axiosConfig';
import { useNavigate } from 'react-router-dom';
import './CreateDiscussionPage.css';

const CreateDiscussionPage = () => {
    const [category, setCategory] = useState('');
    const [subject, setSubject] = useState('');
    const [commentContent, setCommentContent] = useState('');
    const [errorMessage, setErrorMessage] = useState('');

    const navigate = useNavigate();

const handleSubmit = async (event) => {
    event.preventDefault();

    try {
        const requestData = {
            category,
            subject,
            comment: {
                comment_content: commentContent,
            }
        };

        const response = await axiosInstance.post('/discussions/create/', requestData);
        console.log("Response Data:", response.data);

        if (response.status === 201) {
            // Extract the discussion ID from the response data correctly
            // Assuming the response structure is { discussion: { id: x }, comment: {...} }
            const discussionId = response.data.discussion.id; // Adjusted to match the structured response
            navigate(`/discussions/${discussionId}`);
        } else {
            setErrorMessage('Something went wrong. Please try again.');
        }
    } catch (error) {
        console.error('Submission error:', error);
        setErrorMessage('Error: ' + error.message);
    }
};


    return (
        <div className="create-discussion-container">
            <h2 className="create-discussion-heading">Create a New Discussion</h2>
            <form onSubmit={handleSubmit} className="create-discussion-form">
                <input
                    type="text"
                    className="create-discussion-input"
                    id="category"
                    placeholder="Category"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                />
                <input
                    type="text"
                    className="create-discussion-input"
                    id="subject"
                    placeholder="Subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                />
                <textarea
                    className="create-discussion-textarea"
                    id="commentContent"
                    placeholder="Initial Comment"
                    value={commentContent}
                    onChange={(e) => setCommentContent(e.target.value)}
                    required
                ></textarea>
                <button type="submit" className="create-discussion-submit-button">Create Discussion</button>
            </form>
            {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
    );
};

export default CreateDiscussionPage;
