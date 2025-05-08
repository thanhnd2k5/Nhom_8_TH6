import React from 'react';
import { Form, Input, DatePicker, Row, Col, Button, FormInstance } from 'antd';

interface DestinationFormProps {
  form: FormInstance;
  onFinish: (values: any) => void;
  initialValues?: any;
  submitText?: string;
}

const DestinationForm: React.FC<DestinationFormProps> = ({
  form,
  onFinish,
  initialValues,
  submitText = 'Lưu'
}) => {
  return (
    <Form 
      form={form} 
      layout="vertical" 
      onFinish={onFinish}
      initialValues={initialValues}
    >
      <Form.Item 
        name="name" 
        label="Tên điểm du lịch" 
        rules={[{ required: true, message: 'Vui lòng nhập tên điểm du lịch' }]}
      >
        <Input />
      </Form.Item>
      
      <Form.Item name="description" label="Mô tả">
        <Input.TextArea rows={3} />
      </Form.Item>
      
      <Form.Item 
        name="date" 
        label="Ngày" 
        rules={[{ required: true, message: 'Vui lòng chọn ngày' }]}
      >
        <DatePicker style={{ width: '100%' }} format="DD/MM/YYYY" />
      </Form.Item>
      
      <Form.Item name="duration" label="Thời gian">
        <Input placeholder="VD: 2N1Đ" />
      </Form.Item>
      
      <Row gutter={16}>
        <Col span={8}>
          <Form.Item name="foodCost" label="Chi phí ăn uống">
            <Input type="number" min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="accommodationCost" label="Chi phí lưu trú">
            <Input type="number" min={0} />
          </Form.Item>
        </Col>
        <Col span={8}>
          <Form.Item name="transportCost" label="Chi phí di chuyển">
            <Input type="number" min={0} />
          </Form.Item>
        </Col>
      </Row>
      
      <Form.Item>
        <Button type="primary" htmlType="submit" block>
          {submitText}
        </Button>
      </Form.Item>
    </Form>
  );
};

export default DestinationForm;
