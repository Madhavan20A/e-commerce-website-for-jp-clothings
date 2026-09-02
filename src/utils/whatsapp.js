import { SHOP_WHATSAPP_NUMBER } from "../constants";
import { formatINR } from "./storage";

export function generateWhatsAppLink(order) {
    if (!order) return "#";

    const itemsText = order.items
        .map(
            (item, idx) =>
                `${idx + 1}. *${item.name}*\n   Size: ${item.size || "N/A"} | Color: ${item.color || "N/A"}\n   Qty: ${item.qty} x ${formatINR(item.price)} = *${formatINR(item.price * item.qty)}*`
        )
        .join("\n\n");

    const message = `👑 *NEW ORDER - JP CLOTHING* 👑

*Order ID:* ${order.id}
*Date:* ${new Date(order.date).toLocaleString("en-IN")}

*Customer Details:*
• *Name:* ${order.customer.name}
• *Phone:* ${order.customer.phone}
• *Email:* ${order.customer.email || "N/A"}
• *Address:* ${order.customer.address}, ${order.customer.city}, ${order.customer.state} - ${order.customer.pincode}
• *Notes:* ${order.customer.notes || "None"}

*Order Items:*
${itemsText}

-----------------------------
*Subtotal:* ${formatINR(order.subtotal || order.total)}
*Discount:* ${order.discount ? "-" + formatINR(order.discount) : "₹0"}
*Delivery Charge:* ${order.deliveryCharge ? formatINR(order.deliveryCharge) : "FREE"}
*Grand Total:* *${formatINR(order.total)}*
*Payment Method:* ${order.paymentMethod || "Cash on Delivery"}
*Status:* ${order.status || "Pending"}

Please confirm my order. Thank you!`;

    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${SHOP_WHATSAPP_NUMBER}?text=${encodedMessage}`;
}
