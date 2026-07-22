import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdmin } from "@/lib/admin-auth";

export async function GET(request: NextRequest) {
  try {
    await requireAdmin();

    const { searchParams } = new URL(request.url);
    const status = searchParams.get("status") || "all";
    const page = parseInt(searchParams.get("page") || "1", 10);
    const limit = 20;
    const skip = (page - 1) * limit;

    const where = status !== "all" ? { status } : {};

    const [orders, total, countsGroup] = await Promise.all([
      prisma.order.findMany({
        where,
        include: {
          user: {
            select: { id: true, name: true, email: true, phone: true },
          },
          items: {
            include: {
              product: { select: { id: true, name: true, slug: true } },
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.order.count({ where }),
      prisma.order.groupBy({
        by: ["status"],
        _count: { _all: true },
      }),
    ]);

    const counts: Record<string, number> = {
      pending: 0,
      confirmed: 0,
      in_progress: 0,
      completed: 0,
      cancelled: 0,
    };
    countsGroup.forEach((item) => {
      if (item.status in counts) {
        counts[item.status] = item._count._all;
      }
    });

    return NextResponse.json({ orders, total, page, limit, counts });
  } catch (error: any) {
    console.error("Admin Orders GET Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    await requireAdmin();

    const { id, status } = await request.json();

    const validStatuses = ["pending", "confirmed", "in_progress", "completed", "cancelled"];
    if (!id || !validStatuses.includes(status)) {
      return NextResponse.json({ error: "ID atau status tidak valid." }, { status: 400 });
    }

    const updatedOrder = await prisma.order.update({
      where: { id },
      data: { status },
    });

    return NextResponse.json({ success: true, order: updatedOrder });
  } catch (error: any) {
    console.error("Admin Orders PATCH Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin();

    const { id } = await request.json();
    if (!id) {
      return NextResponse.json({ error: "ID pesanan diperlukan." }, { status: 400 });
    }

    await prisma.order.delete({ where: { id } });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Admin Orders DELETE Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
