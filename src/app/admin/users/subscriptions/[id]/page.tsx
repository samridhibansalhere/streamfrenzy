"use client";
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { message } from "antd";
import { getUserSubscription } from "@/server-actions/users";
import { getDateTimeFormat } from "@/helpers/date-time-formats";

const UserSubscriptionPage = () => {
  const { id: userId } = useParams();
  const [subscription, setSubscription] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSubscription = async () => {
      try {
        console.log(`Fetching subscription for user ID: ${userId}`);
        const result = await getUserSubscription(userId);
        if (result.success) {
          setSubscription(result.data);
        } else {
          message.error(result.message);
        }
      } catch (error) {
        message.error("Error fetching subscription data");
      } finally {
        setLoading(false);
      }
    };

    fetchSubscription();
  }, [userId]);

  if (loading) return <div className="text-center text-gray-500">Loading...</div>;

  const renderSubscriptionProperty = (label: string, value: string) => {
    return (
      <div className="flex flex-col">
        <span className="font-bold text-sm">{label}</span>
        <span className="text-sm text-gray-600">{value}</span>
      </div>
    );
  };

  return (
    <div className="p-5">
      <h1 className="text-2xl font-bold mb-5">User Subscription</h1>
      {subscription ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {renderSubscriptionProperty("Plan", subscription.planName)}
          {renderSubscriptionProperty("Price", `$${subscription.price}`)}
          {renderSubscriptionProperty("Expiry Date", getDateTimeFormat(subscription.expiryDate))}
          {renderSubscriptionProperty("Payment ID", subscription.paymentId)}
          {renderSubscriptionProperty("Purchased On", getDateTimeFormat(subscription.createdAt))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No subscription data available.</p>
      )}
    </div>
  );
}

export default UserSubscriptionPage;
