import React from 'react';
import { Modal, Form, Input, DatePicker, Select, Button } from 'antd';
import { FormInstance } from 'antd/lib/form';

interface AddToItineraryModalProps {
  visible: boolean;
  destination: any;
  form: FormInstance;
  itineraryList: any[];
  onCancel: () => void;
  onFinish: (values: any) => void;
}

const AddToItineraryModal: React.FC<AddToItineraryModalProps> = ({
  visible,
  destination,
  form,
  itineraryList,
  onCancel,
  onFinish
}) => {
  return (
    <Modal
      title={`Thêm ${destination?.name || ''} vào lịch trình`}
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
      >
        <Form.Item
          name="itineraryId"
          label="Chọn lịch trình"
          rules={[{ required: true, message: 'Vui lòng chọn lịch trình!' }]}
        >
          <Select placeholder="Chọn lịch trình">
            {itineraryList.map(item => (
              <Select.Option value={item.id} key={item.id}>
                {item.name}
              </Select.Option>
            ))}
          </Select>
        </Form.Item>
        
        <Form.Item
          name="date"
          label="Chọn ngày"
          rules={[{ required: true, message: 'Vui lòng chọn ngày!' }]}
        >
          <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
        </Form.Item>
        
        <Form.Item
          name="notes"
          label="Ghi chú"
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" style={{ width: '100%' }}>
            Thêm vào lịch trình
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddToItineraryModal;
