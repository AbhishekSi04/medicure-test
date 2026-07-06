// this tellme the user is logged in through clerk and presnt in the database or not
'use server'

import { currentUser } from "@clerk/nextjs/server"
import { db } from "./prisma";

export const checkUser = async () => {
        const user = await currentUser();

        console.log(user);
        if(!user) {
            return {
                error: "User not found"
            }
        }
        
        try {
                // First check if user exists by clerkUserId
                let loggedInUser = await db.user.findUnique({
                    where: {
                        clerkUserId: user.id
                    },
                })
                
                if(loggedInUser) {
                    return loggedInUser
                }
                
                // If not found by clerkUserId, check if user exists by email
                loggedInUser = await db.user.findUnique({
                    where: {
                        email: user.emailAddresses[0].emailAddress
                    },
                })
                
                if(loggedInUser) {
                    // Update the existing user with the new clerkUserId
                    loggedInUser = await db.user.update({
                        where: {
                            email: user.emailAddresses[0].emailAddress
                        },
                        data: {
                            clerkUserId: user.id,
                            name: user.firstName + " " + user.lastName,
                        }
                    })
                    return loggedInUser
                }
                
                // If no user exists at all, create a new one
                const name = user.firstName + " " + user.lastName;
                const newUser = await db.user.create({
                    data: {
                        clerkUserId: user.id,
                        name,
                        email: user.emailAddresses[0].emailAddress,
                        role: "UNASSIGNED", // Explicitly set default role
                        transactions:{
                                create:{
                                        type:"CREDIT_PURCHASE",
                                        packageId:"free_user",
                                        amount:2,
                                }
                        }
                    }
                })
                return newUser;

        } catch (error) {
                console.log("Error in checkUser", error);
                return {
                    error: "Internal server error"
                }
        }
}
