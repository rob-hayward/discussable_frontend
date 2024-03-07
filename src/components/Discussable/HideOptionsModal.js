// src/components/Discussable/HideOptionsModal.js

import React from 'react';
import './HideOptionsModal.css';

const HideOptionsModal = ({ isOpen, onClose, onOptionSelect, selectedCommentId, selectedCreatorId }) => {
  // Updated button click handler to pass action type and selectedCommentId
  const handleHideComment = () => {
    onOptionSelect('hideComment', selectedCommentId);
  };

  const handleHideAllFromUser = () => {
    onOptionSelect('hideAllFromUser', selectedCreatorId);
  };

  if (!isOpen) return null;

  return (
    <div className="modal-background">
      <div className="modal-content">
        <p>Would you like to:</p>
        <button onClick={handleHideComment}>Hide just this comment</button>
        <button onClick={handleHideAllFromUser}>Hide all comments from this user
        </button>
        <button onClick={onClose}>Cancel</button>
      </div>
    </div>
  );
};

export default HideOptionsModal;
