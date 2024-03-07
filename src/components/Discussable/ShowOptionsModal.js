// src/components/Discussable/ShowOptionsModal.js

import React from 'react';
import './ShowOptionsModal.css'; // Make sure to create a corresponding CSS file if needed

const ShowOptionsModal = ({ isOpen, onClose, onOptionSelect, selectedCommentId, selectedCreatorId }) => {
  // Button click handlers to pass action type and selected ID
  const handleShowComment = () => {
    onOptionSelect('showComment', selectedCommentId);
  };

  const handleShowAllFromUser = () => {
    onOptionSelect('showAllFromUser', selectedCreatorId);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-background">
      <div className="modal-content">
        <p>What would you like to make visible again?</p>
        <button onClick={handleShowComment}>Show just this comment</button>
        <button onClick={handleShowAllFromUser}>Show all comments from this user</button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default ShowOptionsModal;
