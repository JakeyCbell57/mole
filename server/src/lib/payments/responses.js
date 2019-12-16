module.exports = {
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  FATAL: 'FATAL',
  order: ({ status, orderId, orderTotal, processingFee }) => ({
    status,
    orderId,
    processingFee,
    orderTotal,
    createdAt: Date.now()
  })
};
