import { Router } from 'express';
import {
  getPayments,
  getPaymentById,
  payBill,
  getStats,
  testSendMail,
  testCreateBill,
  testSendReminder,
  testFullFlow,
  updateUsage,
  deletePayment
} from '../controllers/payment.controller.js';

const router = Router();

router.get('/', getPayments);
router.get('/stats', getStats);
router.get('/:id', getPaymentById);
router.put('/:id/pay', payBill);
router.put('/:id/usage', updateUsage);
router.delete('/:id', deletePayment);
router.post('/testSendMail', testSendMail);
router.post('/testCreateBill', testCreateBill);
router.post('/testSendReminder', testSendReminder);
router.post('/testFullFlow', testFullFlow);

export default router;
