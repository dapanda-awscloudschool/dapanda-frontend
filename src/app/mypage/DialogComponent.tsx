import React from "react";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Image from "next/image";
import { formatCurrency } from "@/components/formatCurrency";

interface DialogComponentProps {
  isOpen: boolean;
  onClose: () => void;
  selectedProduct: any;
}

const DialogComponent: React.FC<DialogComponentProps> = ({
  isOpen,
  onClose,
  selectedProduct,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">{"결제하기"}</DialogTitle>
      <DialogContent>
        {selectedProduct && (
          <div className="flex flex-col w-full">
            <div className="flex items-center mb-4">
              <Image
                src={selectedProduct.imageUrl}
                alt={selectedProduct.product_name}
                width={80}
                height={80}
                className="rounded-lg"
              />
              <div className="ml-4">
                <Typography variant="h6" className="mt-4">
                  {selectedProduct.product_name}
                </Typography>
                <Typography variant="body1" className="mt-2">
                  가격: {formatCurrency(selectedProduct.end_price)}
                </Typography>
              </div>
            </div>
            <div className="flex justify-between items-center mt-4">
              <Typography variant="body1">상품금액:</Typography>
              <Typography variant="body1">
                {formatCurrency(selectedProduct.end_price)}
              </Typography>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Typography variant="body1">배송비:</Typography>
              <Typography variant="body1">{formatCurrency(2500)}</Typography>
            </div>
            <div className="flex justify-between items-center mt-2">
              <Typography variant="body1">할인금액:</Typography>
              <Typography variant="body1">{formatCurrency(0)}</Typography>
            </div>
            <div className="flex justify-between items-center mt-4 border-t pt-4">
              <Typography variant="h6">최종결제금액:</Typography>
              <Typography variant="h6">
                {formatCurrency(selectedProduct.end_price + 2500)}
              </Typography>
            </div>
          </div>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          취소
        </Button>
        <Button
          onClick={() => console.log("결제 처리 로직")}
          color="primary"
          autoFocus
        >
          결제하기
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default DialogComponent;
