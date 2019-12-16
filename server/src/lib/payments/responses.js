module.exports = {
  APPROVED: 'APPROVED',
  DECLINED: 'DECLINED',
  FATAL: 'FATAL',
  order: ({ status, orderId, error }) => ({
    status,
    orderId,
    createdAt: Date.now(),
    error
  })
};
