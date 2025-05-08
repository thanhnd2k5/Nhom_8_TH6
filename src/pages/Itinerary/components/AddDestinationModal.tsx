import React from 'react';
import { Modal, FormInstance } from 'antd';
import DestinationForm from './DestinationForm';

interface AddDestinationModalProps {
  visible: boolean;
  form: FormInstance;
  onCancel: () => void;
  onFinish: (values: any) => void;
}

const AddDestinationModal: React.FC<AddDestinationModalProps> = ({
  visible,
  form,
  onCancel,
  onFinish
}) => {
  return (
    <Modal
      title="Thêm điểm du lịch"
      visible={visible}
      onCancel={onCancel}
      footer={null}
    >
      <DestinationForm
        form={form}
        onFinish={onFinish}
        submitText="Thêm điểm du lịch"
      />
    </Modal>
  );
};

export default AddDestinationModal;
