export const mockAPIBuyer = {
  success: true,
  message: "Berhasil mengambil detail transaksi",
  data: {
    id: "abc123",
    transactionCode: "RKB -8080123456789",
    status: "pending_payment", // pending_payment, waiting_shipment, shipped, completed, refunded, cancelled, dispute
    itemName: "iPhone 13 Pro Max",
    itemPrice: 8000000,
    insuranceFee: 160000,
    platformFee: 64000,
    totalAmount: 8080000,
    virtualAccount: "8080123456789",
    sellerEmail: "irgil68@gmail.com",
    createdAt: "2025-06-09T14:00:00Z",
    paymentDeadline: "2025-06-09T17:00:00Z",
    paidAt: "2025-06-09T16:40:00Z",
    shipmentDeadline: "2025-06-11T16:40:00Z",
    shipmentDate: "2025-06-10T08:00:00Z",

    shipment: {
      trackingNumber: "2345523123JUJ",
      courier: "J&T Express Indonesia",
    },

    fundReleaseRequest: {
      requested: true,
      status: null, // "rejected" atau "approved" atau "waiting"
      requestedAt: "2025-06-16T08:00:00Z",
      resolvedAt: "2025-06-16T10:00:00Z",
    },

    buyerConfirmDeadline: "2025-06-17T10:00:00Z",
    buyerConfirmedAt: "2025-06-17T09:00:00Z",

    currentTimestamp: "2025-06-09T15:00:00Z",
  },
};

export const mockAPISeller = {
  success: true,
  message: "Transaksi berhasil dibuat",
  data: {
    id: "12345678",
    transactionCode: "TXN-8080123456789",
    status: "completed", // enum: pending_payment, waiting_shipment, shipped, completed, refunded, cancelled, dispute
    itemName: "iPhone 13 Pro Max",
    itemPrice: 8000000,
    insuranceFee: 16000,
    serviceFee: 64000,
    totalAmount: 8080000,
    virtualAccount: "808012345678",
    buyerEmail: "bayuseptyan925@gmail.com",
    sellerEmail: "irgil68@gmail.com",
    withdrawalBankAccountId: "0900604501",

    paymentDeadline: "2025-06-12T16:00:00Z",
    paidAt: "2025-06-12T13:00:00Z",

    shipmentDeadline: "2025-06-13T13:00:00Z",
    shipmentDate: "2025-06-12T15:00:00Z",

    confirmedAt: "2025-06-12T21:00:00Z",
    buyerConfirmDeadline: "2025-06-17T10:00:00Z",

    createdAt: "2025-06-12T13:00:00Z",
    created_at: "2025-06-12T13:00:00Z", // untuk jaga-jaga jika backend pakai snake_case
    currentTimestamp: "2025-06-12T18:00:00Z",

    sellerBank: {
      bankId: 1,
      bankName: "Bank Negara Indonesia",
      bankLogoUrl: "https://example.com/bni-logo.png",
    },

    fundReleaseRequest: {
      requested: true,
      status: "approved", // opsi lain: approved, waiting
      requestedAt: "2025-06-16T08:00:00Z",
      resolvedAt: "2025-06-16T10:00:00Z",
    },

    shipment: {
      trackingNumber: "2345523123JUJ",
      courier: "J&T Express Indonesia",
    },
  },
};
