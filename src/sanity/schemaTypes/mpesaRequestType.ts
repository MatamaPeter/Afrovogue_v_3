const mpesaRequestType = {
  name: "mpesaRequest",
  title: "M-Pesa Request",
  type: "document",
  fields: [
    { name: "orderNumber", title: "Order Number", type: "string" },
    { name: "amount", title: "Amount", type: "number" },
    { name: "phone", title: "Phone", type: "string" },
    { name: "merchantRequestId", title: "MerchantRequestID", type: "string" },
    { name: "checkoutRequestId", title: "CheckoutRequestID", type: "string" },
    { name: "status", title: "Status", type: "string" },
    { name: "mpesaReceipt", title: "Mpesa Receipt", type: "string" },
    { name: "resultCode", title: "Result Code", type: "number" },
    { name: "resultDesc", title: "Result Desc", type: "string" },
    { name: "raw", title: "Raw Response", type: "object" },
    { name: "createdAt", title: "Created At", type: "datetime" },
    { name: "updatedAt", title: "Updated At", type: "datetime" },
  ],
};

export default mpesaRequestType;
