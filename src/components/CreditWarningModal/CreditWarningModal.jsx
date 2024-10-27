// src/components/CreditWarningModal.js
import React, { useState } from 'react';
import { Modal, Button } from 'antd';
import { useNavigate } from 'react-router-dom';

export const CreditWarningModal = ({ isModalVisible, setIsModalVisible }) => {

  const showModal = () => {
    setIsModalVisible(true);
  };

  const navigate = useNavigate()

  const handleOk = () => {
    navigate('/store')
    setIsModalVisible(false);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  return (
    <Modal
        title="Insufficient Credits"
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        okText="Add Credits"
              cancelText="Cancel"
              centered
      >
        <p>You have insufficient credits to perform this action. Please add more credits to continue.</p>
      </Modal>
  );
};