import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { items, customerDetails, totalAmount } = await request.json();

    // 1. Generate Order ID
    const orderId = "ORD-" + Math.floor(100000 + Math.random() * 900000);

    // 2. Try to save order inside SQLite/Database
    // In database strategy, we first find or create a dummy user since auth isn't fully completed.
    // If table doesn't exist yet or DB isn't migrated, we catch the error gracefully and still return the order.
    let createdOrder = null;
    try {
      let user = await prisma.user.findFirst({
        where: { email: customerDetails.email },
      });

      if (!user) {
        user = await prisma.user.create({
          data: {
            name: customerDetails.name,
            email: customerDetails.email,
            password: "hashed_dummy_password", // Dummy placeholder
            phone: customerDetails.phone,
            role: "customer",
          },
        });
      }

      createdOrder = await prisma.order.create({
        data: {
          id: orderId,
          userId: user.id,
          status: "pending",
          totalAmount: totalAmount,
          paymentMethod: customerDetails.paymentMethod || null,
          shippingName: customerDetails.name,
          shippingPhone: customerDetails.phone,
          shippingAddr: customerDetails.address,
          notes: customerDetails.notes,
          items: {
            create: items.map((item: any) => ({
              productId: item.id,
              quantity: item.quantity,
              price: item.price,
            })),
          },
        },
      });
    } catch (dbError) {
      console.warn("DB insert skipped (likely tables not migrated yet):", dbError);
    }

    // 3. Midtrans Integration Check
    const serverKey = process.env.MIDTRANS_SERVER_KEY;
    const clientKey = process.env.MIDTRANS_CLIENT_KEY;

    if (serverKey && clientKey) {
      // If server key is present, let's create dynamic Snap transaction
      const authHeader = Buffer.from(serverKey + ":").toString("base64");
      const isProd = process.env.MIDTRANS_IS_PRODUCTION === "true";
      const midtransUrl = isProd
        ? "https://app.midtrans.com/snap/v1/transactions"
        : "https://app.sandbox.midtrans.com/snap/v1/transactions";

      const payload = {
        transaction_details: {
          order_id: orderId,
          gross_amount: totalAmount,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: customerDetails.name,
          email: customerDetails.email,
          phone: customerDetails.phone,
          billing_address: {
            address: customerDetails.address,
          },
        },
        item_details: items.map((item: any) => ({
          id: item.id,
          price: item.price,
          quantity: item.quantity,
          name: item.name,
        })),
      };

      const response = await fetch(midtransUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
          Authorization: `Basic ${authHeader}`,
        },
        body: JSON.stringify(payload),
      });

      const midtransData = await response.json();
      if (midtransData.token) {
        return NextResponse.json({
          token: midtransData.token,
          redirect_url: midtransData.redirect_url,
          orderId,
        });
      }
    }

    // Fallback: If no server keys, return orderId without token (which triggers manual WhatsApp flow on client)
    return NextResponse.json({ orderId });
  } catch (error: any) {
    console.error("Payment API Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
