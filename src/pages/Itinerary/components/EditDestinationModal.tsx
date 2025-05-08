import React, { useEffect } from 'react';
import { Modal, FormInstance } from 'antd';
import DestinationForm from './DestinationForm';
import dayjs from 'dayjs';

interface EditDestinationModalProps {
  visible: boolean;
  form: FormInstance;
  destination: any;
  onCancel: () => void;
  onFinish: (values: any) => void;
}

const EditDestinationModal: React.FC<EditDestinationModalProps> = ({
  visible,
  form,
  destination,
  onCancel,
  onFinish
}) => {
  useEffect(() => {
    if (visible && destination) {
      form.setFieldsValue({
        name: destination.name,
        description: destination.description,
        date: destination.date ? dayjs(destination.date) : null,
        foodCost: destination.foodCost || 0,
        accommodationCost: destination.accommodationCost || 0,
        transportCost: destination.transportCost || 0,
        duration: destination.duration,
      });
    }
  }, [visible, destination, form]);

  return (
    <Modal
      title="Sửa điểm du lịch"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <DestinationForm
        form={form}
        onFinish={onFinish}
        submitText="Cập nhật"
      />
    </Modal>
  );
};

export default EditDestinationModal;
