import Link from "next/link";
import { MY_ORDERS_QUERYResult } from "../../sanity.types";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Image from "next/image";
import { urlFor } from "@/sanity/lib/image";
import PriceFormatter from "./PriceFormatter";
import { FileDown } from "lucide-react";

interface OrderDetailsDialogProps {
  order: MY_ORDERS_QUERYResult[number] | null;
  isOpen: boolean;
  onClose: () => void;
}

const OrderDetailDialog: React.FC<OrderDetailsDialogProps> = ({
  order,
  isOpen,
  onClose,
}) => {
  if (!order) return null;
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="!max-w-4xl max-h-[90vh] overflow-y-auto rounded-2xl shadow-xl p-6">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold text-gray-800">
            Order #{order?.orderNumber}
          </DialogTitle>
        </DialogHeader>

        {/* Customer Details */}
        <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 rounded-xl p-4 border">
          <div>
            <p className="text-sm text-gray-500">Customer</p>
            <p className="font-medium">{order.customerName}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Email</p>
            <p className="font-medium">{order.email}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Date</p>
            <p className="font-medium">
              {order.orderDate &&
                new Date(order.orderDate).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Status</p>
            <span className="inline-block px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-700 capitalize">
              {order.status}
            </span>
          </div>
          <div>
            <p className="text-sm text-gray-500">Invoice</p>
            <p className="font-medium">{order?.invoice?.number ?? "N/A"}</p>
          </div>
          {order?.invoice?.hosted_invoice_url && (
            <div className="flex items-center">
              <Button
                variant="outline"
                className="flex items-center gap-2 text-kitenge-red border-kitenge-red hover:bg-kitenge-red/10 hover:text-kitenge-red"
                asChild
              >
                <Link href={order.invoice.hosted_invoice_url} target="_blank">
                  <FileDown className="h-4 w-4" /> Download Invoice
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Products Table */}
        <div className="mt-6">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-100">
                <TableHead>Product</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Price</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {order.products?.map((product, index) => (
                <TableRow
                  key={index}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <TableCell className="flex items-center gap-3">
                    {product?.product?.images && (
                      <Image
                        src={urlFor(product.product.images[0]).url()}
                        alt="productImage"
                        width={48}
                        height={48}
                        className="border rounded-lg"
                      />
                    )}
                    <span className="font-medium">
                      {product?.product?.name}
                    </span>
                  </TableCell>
                  <TableCell className="font-medium">
                    {product?.quantity}
                  </TableCell>
                  <TableCell>
                    <PriceFormatter
                      amount={product?.product?.price}
                      className="text-gray-800 font-semibold"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Totals */}
        <div className="mt-6 flex justify-end">
          <div className="w-full sm:w-1/3 bg-gray-50 p-4 rounded-xl border space-y-2">
            {order?.amountDiscount !== 0 && (
              <>
                <div className="flex justify-between text-gray-600">
                  <span>Discount:</span>
                  <PriceFormatter
                    amount={order?.amountDiscount}
                    className="font-semibold"
                  />
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal:</span>
                  <PriceFormatter
                    amount={
                      (order?.totalPrice as number) +
                      (order?.amountDiscount as number)
                    }
                    className="font-semibold"
                  />
                </div>
              </>
            )}
            <div className="flex justify-between text-gray-900 text-lg font-bold border-t pt-2">
              <span>Total:</span>
              <PriceFormatter amount={order?.totalPrice} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
