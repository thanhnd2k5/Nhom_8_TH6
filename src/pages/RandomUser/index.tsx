import type { IColumn } from '@/components/Table/typing';
import { Button, Modal, Table, Tabs } from 'antd';
import { useEffect } from 'react';
import { useModel } from 'umi';
import FormRandomUser from './Form';
import BudgetManagement from '../BudgetManagement/BudgetManagement';

const { TabPane } = Tabs;

const RandomUser = () => {
	const { data, getDataUser, setRow, isEdit, setVisible, setIsEdit, visible } = useModel('randomuser');

	useEffect(() => {
		getDataUser();
	}, []);

	const columns: IColumn<RandomUser.Record>[] = [
		{
			title: 'Address',
			dataIndex: 'address',
			key: 'name',
			width: 200,
		},
		{
			title: 'Balance',
			dataIndex: 'balance',
			key: 'age',
			width: 100,
		},
		{
			title: 'Action',
			width: 200,
			align: 'center',
			render: (record) => {
				return (
					<div>
						<Button
							onClick={() => {
								setVisible(true);
								setRow(record);
								setIsEdit(true);
							}}
						>
							Edit
						</Button>
						<Button
							style={{ marginLeft: 10 }}
							onClick={() => {
								const dataLocal: any = JSON.parse(localStorage.getItem('data') as any);
								const newData = dataLocal.filter((item: any) => item.address !== record.address);
								localStorage.setItem('data', JSON.stringify(newData));
								getDataUser();
							}}
							type='primary'
						>
							Delete
						</Button>
					</div>
				);
			},
		},
	];

	return (
		<div>
			<Tabs defaultActiveKey="budget">
				<TabPane tab="Quản lý ngân sách" key="budget">
					<BudgetManagement />
				</TabPane>
				<TabPane tab="Random User" key="randomUser">
					<div style={{ padding: 16 }}>
						<Button
							type='primary'
							onClick={() => {
								setVisible(true);
								setIsEdit(false);
							}}
						>
							Add User
						</Button>

						<Table dataSource={data} columns={columns} />

						<Modal
							destroyOnClose
							footer={false}
							title={isEdit ? 'Edit User' : 'Add User'}
							visible={visible}
							onOk={() => {}}
							onCancel={() => {
								setVisible(false);
							}}
						>
							<FormRandomUser />
						</Modal>
					</div>
				</TabPane>
			</Tabs>
		</div>
	);
};

export default RandomUser;
