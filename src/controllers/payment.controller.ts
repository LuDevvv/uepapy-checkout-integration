import { Request, Response } from "express";
import { encryptData } from "../services/uepapay.service";

const {
  UEPA_MERCHANT_ID,
  UEPA_MERCHANT_NAME,
  UEPA_MERCHANT_TYPE,
  UEPA_PUBLIC_TOKEN,
  APP_URL,
} = process.env;

export const generateUepaPayUrl = async (req: Request, res: Response) => {
  const { orderNumber, amount, amountWithTaxes, details } = req.body;

  const currentDate = new Date().toISOString();

  const approvedUrl = `${APP_URL}/checkout/success`;
  const declinedUrl = `${APP_URL}/checkout/failure`;
  const cancelUrl = `${APP_URL}/checkout/cancel`;

  const paymentData = `MerchantId=${UEPA_MERCHANT_ID}|MerchantName=${UEPA_MERCHANT_NAME}|MerchantType=${UEPA_MERCHANT_TYPE}|CurrencyCode=$|OrderNumber=${orderNumber}|OrderDetails=${details}|CurrentDate=${currentDate}|Amount=${amountWithTaxes}|ApprovedUrl=${approvedUrl}|DeclinedUrl=${declinedUrl}|CancelUrl=${cancelUrl}|locale=ES`;

  try {
    const encryptedData = await encryptData({ paymentData });

    const paymentUrl = `https://uepapay.com/pl_external.aspx?MerchantId=${UEPA_MERCHANT_ID}&d=${encryptedData}`;

    res.json({ paymentUrl });
  } catch (error) {
    console.error("Error generating payment URL:", error);
    res.status(500).json({ message: "Failed to generate payment URL." });
  }
};

export const validateUepaPayOrder = async (req: Request, res: Response) => {
  const { orderNumberUepaPay, amount } = req.body;

  // Esta parte puede extenderse más adelante con lógica real.
  // Por ahora solo responde fijo como ejemplo.

  res.json({
    message: "Order validated (mock)",
    orderNumberUepaPay,
    amount,
  });
};
