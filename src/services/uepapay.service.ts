import axios from "axios";

const { UEPA_MERCHANT_ID, UEPA_PUBLIC_TOKEN } = process.env;

export async function encryptData({ paymentData }: { paymentData: string }) {
  try {
    const response = await axios.get(
      `https://wsmultisecure.uepatickets.com/Services/UepapAYcONFIGURATIONsERVICE.ASMX/EncryptRequest`,
      {
        params: {
          accountId: UEPA_MERCHANT_ID,
          publicToken: UEPA_PUBLIC_TOKEN,
          data: paymentData,
        },
        headers: {
          "Content-Type": "text/json",
        },
      }
    );

    const raw = response.data;
    const token = raw
      .split(`<string xmlns="http://tempuri.org/">`)[1]
      .split(`</string>`)[0];
    return token;
  } catch (error: any) {
    console.error("Encryption error:", error);
    throw new Error("Failed to encrypt payment data.");
  }
}
