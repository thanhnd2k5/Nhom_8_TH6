import React, { useEffect } from 'react';
import { Modal, Form, Input, DatePicker, Select, Button, message } from 'antd';
import { FormInstance } from 'antd/lib/form';
import { Destination } from '@/models/destination';

interface AddToItineraryModalProps {
  visible: boolean;
  destination: Destination;
  onClose: () => void;
  onSubmit: (values: any) => void;
}

const AddToItineraryModal: React.FC<AddToItineraryModalProps> = ({
  visible,
  destination,
  onClose,
  onSubmit
}) => {
  const [form] = Form.useForm();

  useEffect(() => {
    if (visible) {
      form.resetFields();
    }
  }, [visible, form]);

  const handleSubmit = (values: any) => {
    onSubmit(values);
    message.success(`Đã thêm ${destination.name} vào lịch trình ngày ${values.date.format('DD/MM/YYYY')}`);
  };

  return (
    <Modal
      title={`Thêm ${destination?.name || ''} vào lịch trình`}
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
      >
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
