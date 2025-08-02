
import express from 'express';
import Payment from '../model/MTSEcomPayment.js'; 
import Order from '../model/MTSEcomOrder.js';
import OrderLine from '../model/MTSEcomOrderLine.js';
const router = express.Router();

router.post('/savePaymentData', async (req, res) => {
    try {
      const paymentData = req.body;
      console.log("Received payment data:", req.body); 
      const newPayment = new Payment({
        paymentId: paymentData.razorpayPaymentId,
        paymentOrderId: paymentData.razorpayOrderId,
        paymentSignature: paymentData.razorpaySignature,
        userId: paymentData.userDetails.userId,
        amount: paymentData.amount,
        description: paymentData.description,
        selectedDate: paymentData.selectedDate,
        selectedTime: paymentData.selectedTime,
        status: 'Paid',
        userDetails: paymentData.userDetails, 
        orderId:paymentData.orderId
      });  
      // Save payment to database   
      await newPayment.save();
    //   console.log("Payment data saved successfully for user:", paymentData.userDetails.userId); 
    //    const newOrder = new Order({
    //   orderId: paymentData.orderId,
    //   userId: paymentData.userDetails.userId,
    //   products: paymentData.products || [],
    //   totalAmount: paymentData.amount,
    //   status: 'Paid',
    // });
    //  await newOrder.save();
    //   res.status(200).json({ message: 'Payment data saved successfully' });

     const updatedOrder = await Order.findOneAndUpdate(
      { orderId: paymentData.orderId },
      {
        status: 'Paid',
        razorpayPaymentId: paymentData.razorpayPaymentId,
        razorpayOrderId: paymentData.razorpayOrderId,
        razorpaySignature: paymentData.razorpaySignature,
        updatedAt: new Date(),
      },
      { new: true }
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.status(200).json({ message: 'Payment saved and order updated', updatedOrder });

    } catch (error) {
      console.error('Error saving payment data:', error);
      res.status(500).json({ message: 'An error occurred while saving payment data' });
    }
  });
  
  router.get('/getPaymentsByUser/:userId', async (req, res) => {
    const userId = req.params.userId;
  
    try {
      // Fetch all payment data for the given userId
      const payments = await Payment.find({ userId });
  
      if (payments.length === 0) {
        return res.status(404).json({ message: 'No payments found for this user.' });
      }
      const paymentsWithOrderDetails = await Promise.all(
        payments.map(async (payment) => {
          // Fetch the associated order based on orderId
          const orderData = await Order.findOne({ orderId: payment.orderId });
  
          if (!orderData) {
            return { ...payment._doc, orderData: null }; 
          }
          const productsWithImages = orderData.products
          ? orderData.products.map((product) => ({
              productName: product.productName,
              quantity: product.quantity,
              price: product.price,
              imageUrl: product.imageUrl || '', 
            }))
          : [];
          return {
            ...payment._doc,
            orderData: {
              ...orderData._doc,
              products: productsWithImages,
            },
          };
        })
      );
      // Return all payment data
      res.status(200).json({ payments: paymentsWithOrderDetails });
    } catch (error) {
      console.error('Error fetching payments:', error);
      res.status(500).json({ message: 'An error occurred while fetching payments.' });
    }
  });
  
  router.get('/getOrderDetailsForPayment/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
  
    try {
      
      const orderData = await Order.findOne({ orderId });
      
  
      if (!orderData) {
        return res.status(404).json({ message: 'No order found for this orderId.' });
      }
  
      const orderLines = await OrderLine.find({ orderId });
  
      if (!orderLines || orderLines.length === 0) {
        return res.status(404).json({ message: 'No order lines found for this orderId.' });
      }
  
      const productsWithImages = orderData.products
      ? orderData.products.map((product) => ({
          productName: product.productName,
          quantity: product.quantity,
          price: product.price,
          imageUrl: product.imageUrl || '', 
        }))
      : [];

      
      res.status(200).json({
        orderData: {
          ...orderData._doc,
          products: productsWithImages,
        },
        orderLines,
      });
    } catch (error) {
      console.error('Error fetching order details:', error);
      res.status(500).json({ message: 'An error occurred while fetching order details.' });
    }
  });
  

router.get('/compareOrderWithPayment/:orderId', async (req, res) => {
    const orderId = req.params.orderId;
    console.log('Fetching payment data for orderId:', orderId);
    try {
      // Fetch payment data based on orderId
      const paymentData = await Payment.findOne({ orderId });
  
      if (!paymentData) {
        return res.status(404).json({ message: 'No payment found for this order.' });
      }
      
      const orderData = await Order.findOne({ orderId });
      if (!orderData) {
        return res.status(404).json({ message: 'No order found for this orderId.' });
      }
  
      // Fetch order lines associated with the orderId
      const orderLines = await OrderLine.find({ orderId });
  
      if (!orderLines || orderLines.length === 0) {
        return res.status(404).json({ message: 'No order lines found for this orderId.' });
      }

  
      // Compare payment and order
      const comparisonResult = {
        payment: paymentData,
        order: orderData,
        orderLines: orderLines,
        comparison: {
          orderMatched: paymentData.orderId === orderData.orderId,
          status: paymentData.status === 'Paid' ? 'Payment Completed' : 'Payment Pending',
          totalAmountMatch: (paymentData.amount / 100) === orderData.totalAmount,
          orderLinesMatch: orderLines.reduce((match, line) => {
            // Compare each line's quantity * price with the payment amount
            const lineAmount = line.quantity * line.price;
            return match && (lineAmount === (paymentData.amount / 100)); 
          }, true)
        }
      };
  
      // Send comparison result
      res.status(200).json(comparisonResult);
    } catch (error) {
      console.error('Error comparing payment and order:', error);  // Log the error here
      res.status(500).json({ message: 'An error occurred while comparing payment and order data.' });
    }
  });
  
  
  

  export default router;
