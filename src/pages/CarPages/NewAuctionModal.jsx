import { Form, Input, Modal, Select } from 'antd';
import React, { useEffect } from 'react';

const { Option } = Select;

export default function NewAuctionModal({ visible, handleCancel, handleOk, selectedCar, buy, setBuy, minBid, setMinBid, setAuctionDuration, auctionDuration }) {
  const [form] = Form.useForm();

  useEffect(() => {
    setMinBid(selectedCar.price / 20)
    setAuctionDuration(1)
  }, [selectedCar.price, setAuctionDuration, setMinBid]);

  return (
    <Modal
          visible={visible}
          centered
      title="Create a New Auction"
      okText="Create"
      cancelText="Cancel"
      onCancel={handleCancel}
      onOk={handleOk}
    >
      <Form form={form} layout="vertical">
          <Form.Item name="minBid" label="Minimal bid" rules={[{ required: true }]}>
          <Select value={minBid} onChange={(value) => setMinBid(value)} defaultValue={selectedCar.price / 25} >
            <Option value={selectedCar.price / 20}>{Math.floor(selectedCar.price / 20)}</Option>
            <Option value={selectedCar.price / 10}>{Math.floor(selectedCar.price / 10)}</Option>
            <Option value={selectedCar.price / 5}>{Math.floor(selectedCar.price / 5)}</Option>
            <Option value={selectedCar.price / 2}>{Math.floor(selectedCar.price / 2)}</Option>
            <Option value={24}>{selectedCar.price}</Option>
          </Select>
              </Form.Item>
        <Form.Item name="buy" label="Buy" rules={[{ required: true }]}>
          <Input type="number" defaultValue={selectedCar.price} value={selectedCar.price} onChange={(event) => setBuy(event.target.value)} disabled />
        </Form.Item>
        <Form.Item name="auctionDuration" label="Auction Duration (hours)" rules={[{ required: true }]}>
          <Select value={auctionDuration} onChange={(value) => setAuctionDuration(value)} defaultValue={1} >
            <Option value={1}>1 hour</Option>
            <Option value={3}>3 hours</Option>
            <Option value={6}>6 hours</Option>
            <Option value={12}>12 hours</Option>
            <Option value={24}>24 hours</Option>
          </Select>
              </Form.Item>
          </Form>
    </Modal>
  );
}
