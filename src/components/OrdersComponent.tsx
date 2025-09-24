"use client";

import { useState } from "react";
import { MY_ORDERS_QUERYResult } from "../../sanity.types";
import { TableBody, TableCell, TableRow } from "./ui/table";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "./ui/tooltip";
import PriceFormatter from "./PriceFormatter";
import { format } from "date-fns";
import { X } from "lucide-react";
import toast from "react-hot-toast";
import OrderDetailDialog from "./OrderDetailDialog";

const OrdersComponent = ({ orders }: { orders: MY_ORDERS_QUERYResult }) => {
  const [selectedOrder, setSelectedOrder] = useState<
    MY_ORDERS_QUERYResult[number] | null
  >(null);

  const handleDelete = () => {
    toast.error("Delete method applied for Admin");
  };

  return (
    <>
      <TableBody>
        <TooltipProvider>
          {orders.map((order) => (
            <Tooltip key={order?.orderNumber}>
              <TooltipTrigger asChild>
                <TableRow
                  className="cursor-pointer h-14 transition-colors hover:bg-gray-50 border-b last:border-0"
                  onClick={() => setSelectedOrder(order)}
                >
                  {/* Order Number */}
                  <TableCell className="font-semibold text-gray-800">
                    {order.orderNumber?.slice(-10) ?? "N/A"}...
                  </TableCell>

                  {/* Date */}
                  <TableCell className="hidden md:table-cell text-gray-600">
                    {order?.orderDate &&
                      format(new Date(order.orderDate), "dd/MM/yyyy")}
                  </TableCell>

                  {/* Customer Name */}
                  <TableCell className="text-gray-800 font-medium">
                    {order.customerName}
                  </TableCell>

                  {/* Email */}
                  <TableCell className="hidden sm:table-cell text-gray-600 truncate max-w-[180px]">
                    {order.email}
                  </TableCell>

                  {/* Total Price */}
                  <TableCell>
                    <PriceFormatter
                      amount={order?.totalPrice}
                      className="text-gray-900 font-semibold"
                    />
                  </TableCell>

                  {/* Status */}
                  <TableCell>
                    {order?.status && (
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${
                          order.status === "paid"
                            ? "bg-gradient-to-r from-green-100 to-green-200 text-green-800"
                            : "bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800"
                        }`}
                      >
                        {order?.status.charAt(0).toUpperCase() +
                          order?.status.slice(1)}
                      </span>
                    )}
                  </TableCell>

                  {/* Invoice Number */}
                  <TableCell className="hidden sm:table-cell">
                    {order?.invoice && (
                      <p className="font-medium text-gray-700 truncate max-w-[140px]">
                        {order?.invoice?.number ?? "----"}
                      </p>
                    )}
                  </TableCell>

                  {/* Delete Action */}
                  <TableCell
                    onClick={(event) => {
                      event.stopPropagation();
                      handleDelete();
                    }}
                    className="flex items-center justify-center"
                  >
                    <div className="p-1.5 rounded-full transition-colors hover:bg-red-100 group">
                      <X
                        size={18}
                        className="text-gray-500 group-hover:text-red-600"
                      />
                    </div>
                  </TableCell>
                </TableRow>
              </TooltipTrigger>

              <TooltipContent className="bg-gray-800 text-white text-xs px-2 py-1 rounded shadow-lg">
                Click to view order details
              </TooltipContent>
            </Tooltip>
          ))}
        </TooltipProvider>
      </TableBody>

      {/* Order Details Dialog */}
      <OrderDetailDialog
        order={selectedOrder}
        isOpen={!!selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </>
  );
};

export default OrdersComponent;
