module.exports = {
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  FATAL: 'FATAL',
  order: ({ status, orderId }) => ({
    status,
    orderId,
    createdAt: Date.now()
  })
};
