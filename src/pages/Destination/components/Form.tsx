import { Button, Form, Input, InputNumber, Rate, Select, Upload, message } from 'antd';
import { useModel } from 'umi';
import { useState } from 'react';
import { UploadOutlined } from '@ant-design/icons';
import { TravelType, travelTypeLabels } from '@/models/destination';

const { TextArea } = Input;

// Hàm tạo ID ngẫu nhiên để thay thế uuid
const generateId = () => {
	return Date.now().toString(36) + Math.random().toString(36).substr(2);
};

const FormDestination = () => {
	const { data, getDestinations, row, isEdit, setVisible } = useModel('destination');
	const [form] = Form.useForm();
	const [imageUrl, setImageUrl] = useState<string>(row?.image || '');

	// Hàm chuyển đổi file thành dạng base64
	const getBase64 = (file: File): Promise<string> => {
		return new Promise((resolve, reject) => {
			const reader = new FileReader();
			reader.readAsDataURL(file);
			reader.onload = () => resolve(reader.result as string);
			reader.onerror = (error) => reject(error);
		});
	};

	const beforeUpload = async (file: File) => {
		const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
		if (!isJpgOrPng) {
			message.error('Bạn chỉ có thể tải lên file JPG/PNG!');
			return Upload.LIST_IGNORE;
		}
		
		const isLt2M = file.size / 1024 / 1024 < 2;
		if (!isLt2M) {
			message.error('Hình ảnh phải nhỏ hơn 2MB!');
			return Upload.LIST_IGNORE;
		}

		try {
			const base64 = await getBase64(file);
			setImageUrl(base64);
			form.setFieldsValue({ image: base64 });
		} catch (error) {
			console.error('Lỗi khi chuyển đổi hình ảnh:', error);
		}
		
		return false;
	};

	return (
		<Form
			form={form}
			layout="vertical"
			initialValues={{
				id: row?.id || '',
				name: row?.name || '',
				description: row?.description || '',
				visitDuration: row?.visitDuration || '',
				foodCost: row?.foodCost || 0,
				accommodationCost: row?.accommodationCost || 0,
				transportCost: row?.transportCost || 0,
				longitude: row?.longitude || 0,
				latitude: row?.latitude || 0,
				rating: row?.rating || 3,
				image: row?.image || '',
				type: row?.type || TravelType.CITY,
			}}
			onFinish={(values) => {
				const formData = {
					...values,
					id: isEdit ? row?.id : generateId(),
					image: imageUrl,
				};

				const dataLocal: Destination.Record[] = JSON.parse(localStorage.getItem('destinations') as any) || [];
				
				if (isEdit) {
					const index = dataLocal.findIndex((item) => item.id === row?.id);
					if (index !== -1) {
						dataLocal[index] = formData;
					}
				} else {
					dataLocal.push(formData);
				}
				
				localStorage.setItem('destinations', JSON.stringify(dataLocal));
				setVisible(false);
				getDestinations();
				message.success(`${isEdit ? 'Cập nhật' : 'Thêm'} điểm đến thành công!`);
			}}
		>
			<Form.Item name="id" hidden>
				<Input />
			</Form.Item>

			<Form.Item
				label="Tên điểm đến"
				name="name"
				rules={[{ required: true, message: 'Vui lòng nhập tên điểm đến!' }]}
			>
				<Input placeholder="Nhập tên điểm đến" />
			</Form.Item>

			<Form.Item
				label="Mô tả"
				name="description"
				rules={[{ required: true, message: 'Vui lòng nhập mô tả điểm đến!' }]}
			>
				<TextArea rows={4} placeholder="Nhập mô tả chi tiết về điểm đến" />
			</Form.Item>

			<Form.Item
				label="Loại hình du lịch"
				name="type"
				rules={[{ required: true, message: 'Vui lòng chọn loại hình du lịch!' }]}
			>
				<Select placeholder="Chọn loại hình du lịch">
					{Object.entries(travelTypeLabels).map(([key, label]) => (
						<Select.Option key={key} value={key}>
							{label}
						</Select.Option>
					))}
				</Select>
			</Form.Item>

			<Form.Item
				label="Thời gian tham quan"
				name="visitDuration"
				rules={[{ required: true, message: 'Vui lòng nhập thời gian tham quan!' }]}
			>
				<Input placeholder="Ví dụ: 2 ngày 1 đêm, 4-5 giờ, v.v." />
			</Form.Item>

			<Form.Item
				label="Chi phí ăn uống (VNĐ)"
				name="foodCost"
				rules={[{ required: true, message: 'Vui lòng nhập chi phí ăn uống!' }]}
			>
				<InputNumber 
					style={{ width: '100%' }} 
					formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
					placeholder="Nhập chi phí ăn uống" 
				/>
			</Form.Item>

			<Form.Item
				label="Chi phí lưu trú (VNĐ)"
				name="accommodationCost"
				rules={[{ required: true, message: 'Vui lòng nhập chi phí lưu trú!' }]}
			>
				<InputNumber 
					style={{ width: '100%' }} 
					formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
					placeholder="Nhập chi phí lưu trú" 
				/>
			</Form.Item>

			<Form.Item
				label="Chi phí di chuyển (VNĐ)"
				name="transportCost"
				rules={[{ required: true, message: 'Vui lòng nhập chi phí di chuyển!' }]}
			>
				<InputNumber 
					style={{ width: '100%' }} 
					formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
					parser={(value) => value!.replace(/\$\s?|(,*)/g, '')}
					placeholder="Nhập chi phí di chuyển" 
				/>
			</Form.Item>

			<Form.Item
				label="Kinh độ"
				name="longitude"
				rules={[{ required: true, message: 'Vui lòng nhập kinh độ!' }]}
			>
				<InputNumber 
					style={{ width: '100%' }} 
					placeholder="Nhập kinh độ" 	
				/>
			</Form.Item>

			<Form.Item
				label="Vĩ độ"
				name="latitude"
				rules={[{ required: true, message: 'Vui lòng nhập vĩ độ!' }]}
			>
				<InputNumber 
					style={{ width: '100%' }} 
					placeholder="Nhập vĩ độ" 	
				/>
			</Form.Item>

			<Form.Item
				label="Rating"
				name="rating"
				rules={[{ required: true, message: 'Vui lòng nhập rating!' }]}
			>
				<Rate 
					style={{ width: '100%' }} 
					allowHalf
					allowClear
				/>
			</Form.Item>

			<Form.Item
				label="Hình ảnh"
				name="image"
			>
				<>
					<Upload
						listType="picture-card"
						showUploadList={false}
						beforeUpload={beforeUpload}
						maxCount={1}
					>
						{imageUrl ? (
							<img src={imageUrl} alt="Hình ảnh điểm đến" style={{ width: '100%' }} />
						) : (
							<div>
								<UploadOutlined />
								<div style={{ marginTop: 8 }}>Tải lên</div>
							</div>
						)}
					</Upload>
					{imageUrl && (
						<Button 
							danger 
							onClick={() => {
								setImageUrl('');
								form.setFieldsValue({ image: '' });
							}}
						>
							Xóa hình ảnh
						</Button>
					)}
				</>
			</Form.Item>

			<div style={{ textAlign: 'right' }}>
				<Button onClick={() => setVisible(false)} style={{ marginRight: 8 }}>
					Hủy
				</Button>
				<Button type="primary" htmlType="submit">
					{isEdit ? 'Cập nhật' : 'Thêm mới'}
				</Button>
			</div>
		</Form>
	);
};

export default FormDestination; 