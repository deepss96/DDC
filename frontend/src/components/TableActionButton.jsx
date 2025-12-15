import React from 'react';
import { FaPencilAlt, FaTrash } from 'react-icons/fa';
import '../assets/CSS/TableActionButton.css';

const TableActionButton = ({ icon: Icon, type, title, onClick }) => {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`table-action-btn ${type}`}
    >
      <Icon className="icon" />
    </button>
  );
};

export default TableActionButton;
