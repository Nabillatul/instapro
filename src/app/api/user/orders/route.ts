import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import prisma from "@/lib/prisma";

export async function PATCH(request: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id, action } = await request.json();
    if (!id || action !== "cancel") {
      return NextResponse.json({ error: "Invalid request" }, { status: 400 });
    }

    const userEmail = session.user.email;
    if (!userEmail) {
      return NextResponse.json({ error: "Invalid user session email" }, { status: 400 });
    }

    // Find user
    const dbUser = await prisma.user.findUnique({
      where: { email: userEmail },
    });
    if (!dbUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Find order
    const order = await prisma.order.findUnique({
      where: { id },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Security check: must belong to the user
    if (order.userId !== dbUser.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Only allow cancellation if order is pending
    if (order.status !== "pending") {
      return NextResponse.json({ error: "Hanya pesanan pending yang dapat dibatalkan." }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status: "cancelled" },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("User Orders PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
