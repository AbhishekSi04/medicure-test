"use server"

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

const PLAN_CREDITS: Record<string, number> = {
  free_user: 2,
  standard: 20,
  premium: 100,
};

/**
 * Detects the user's active Clerk subscription plan.
 */
export async function getCurrentSubscriptionPlan() {
  try {
    const { has } = await auth();

    const hasPremium = has({ plan: "premium" });
    const hasStandard = has({ plan: "standard" });
    const hasBasic = has({ plan: "free_user" });

    if (hasPremium) return { plan: "premium" };
    if (hasStandard) return { plan: "standard" };
    if (hasBasic) return { plan: "free_user" };

    // No paid plan detected — treat as free
    return { plan: "free_user" };
  } catch (error: any) {
    console.error("Failed to get subscription plan:", error.message);
    return { plan: "free_user" };
  }
}

/**
 * Allocates credits to a PATIENT for the current plan, but ONLY if they
 * haven't already received credits for this exact plan.
 * Uses the database as the source of truth (not localStorage).
 */
export async function checkAndAllocateCredits(dbUser: any) {
  try {
    if (!dbUser || "error" in dbUser) {
      return { error: "User not found" };
    }

    // Only allocate credits to patients
    if (dbUser.role !== "PATIENT") {
      return dbUser;
    }

    // Detect current plan from Clerk
    const { plan: currentPlan } = await getCurrentSubscriptionPlan();
    const creditsToAllocate = PLAN_CREDITS[currentPlan] ?? 0;

    if (creditsToAllocate === 0) {
      return dbUser;
    }

    // ── KEY FIX: Check the DB if credits for this plan were already given ──
    const existingTransaction = await db.creditTransaction.findFirst({
      where: {
        userId: dbUser.id,
        type: "CREDIT_PURCHASE",
        packageId: currentPlan,
      },
    });

    if (existingTransaction) {
      // Credits already allocated for this plan — do nothing
      console.log(
        `[credits] Credits for plan "${currentPlan}" already allocated to user ${dbUser.id}.`
      );
      return dbUser;
    }

    // No existing transaction → allocate credits
    const updatedUser = await db.$transaction(async (tx) => {
      await tx.creditTransaction.create({
        data: {
          userId: dbUser.id,
          amount: creditsToAllocate,
          type: "CREDIT_PURCHASE",
          packageId: currentPlan,
        },
      });

      return tx.user.update({
        where: { id: dbUser.id },
        data: { credits: { increment: creditsToAllocate } },
      });
    });

    console.log(
      `[credits] Allocated ${creditsToAllocate} credits for plan "${currentPlan}" to user ${dbUser.id}.`
    );

    revalidatePath("/doctors");
    revalidatePath("/appointments");
    revalidatePath("/");

    return updatedUser;
  } catch (error: any) {
    console.error("Failed to check subscription and allocate credits:", error.message);
    return null;
  }
}