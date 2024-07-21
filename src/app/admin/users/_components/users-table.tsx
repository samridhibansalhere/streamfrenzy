"use client";
import React from "react";
import { IUser } from "@/interfaces/users";
import { Button, Table, Switch, message } from "antd";
import { getDateTimeFormat } from "@/helpers/date-time-formats";
import { useRouter } from 'next/navigation'; 
import { updateUserRole } from "@/server-actions/users";

function UsersTable({ users }: { users: IUser[] }) {
  const router = useRouter();

  const handleRoleChange = async (userId: string, isAdmin: boolean) => {
    try {
      const result = await updateUserRole(userId, isAdmin);
      if (result.success) {
        message.success("User role updated successfully");
        router.refresh();
      } else {
        message.error(result.message);
      }
    } catch (error) {
      console.error("Error updating user role:", error);
      message.error("Error updating user role");
    }
  };

  const handleSubscriptionClick = (userId: string) => {
    router.push(`/admin/users/subscriptions/${userId}`);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "username",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "UserId",
      dataIndex: "_id",
    },
    {
      title: "Role",
      dataIndex: "isAdmin",
      render: (isAdmin: boolean, record: IUser) => (
        <Switch
          checked={isAdmin}
          onChange={() => handleRoleChange(record._id, !isAdmin)}
          checkedChildren="Admin"
          unCheckedChildren="User"
        />
      ),
    },
    {
      title: "Created At",
      dataIndex: "createdAt",
      render: (createdAt: string) => getDateTimeFormat(createdAt),
    },
    {
      title: "Action",
      dataIndex: "action",
      render: (_: any, record: IUser) => (
        !record.isAdmin && (
          <Button size="small" onClick={() => handleSubscriptionClick(record._id)}>
            Subscriptions
          </Button>
        )
      ),
    },
  ];

  return <Table dataSource={users} columns={columns} rowKey="_id" />;
}

export default UsersTable;
