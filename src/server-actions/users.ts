"use server";
import { connectMongoDB } from "@/config/db-config";
import SubscriptionModel from "@/models/subscription-model";
import UserModel from "@/models/user-model";
import { currentUser } from "@clerk/nextjs/server";

connectMongoDB();

export const getCurrentUserFromMongoDB = async () => {
  try {
    const clerkUser = await currentUser();

    const user = await UserModel.findOne({ clerkUserId: clerkUser?.id });
    if (user) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(user)),
      };
    }
    let username = clerkUser?.username || `${clerkUser?.firstName} ${clerkUser?.lastName}`;
    username = username.replace("null", "");
    const userObj = {
      username,
      email: clerkUser?.emailAddresses[0].emailAddress,
      clerkUserId: clerkUser?.id,
      profilePicture: clerkUser?.imageUrl,
      isActive: true,
      isAdmin: false,
    };

    const newUser = await UserModel.create(userObj);
    return {
      success: true,
      data: JSON.parse(JSON.stringify(newUser)),
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const updateUserRole = async (userId: string, isAdmin: boolean) => {
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      userId,
      { isAdmin },
      { new: true }
    );

    if (updatedUser) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(updatedUser)),
      };
    }

    return {
      success: false,
      message: "User not found",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};

export const getUserSubscription = async (userId: string) => {
  try {
    const subscription = await SubscriptionModel.findOne({ user: userId }).populate('user');
    
    if (subscription) {
      return {
        success: true,
        data: JSON.parse(JSON.stringify(subscription)),
      };
    }

    return {
      success: false,
      message: "Subscription not found",
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message,
    };
  }
};