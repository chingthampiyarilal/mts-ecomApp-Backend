import express from 'express';
import MTSEcomOrder from '../model/MTSEcomOrder.js';  // Correct import
import MTSEcomOrderLine from '../model/MTSEcomOrderLine.js';
import Counter from '../model/MTSCounter.js';

const router = express.Router();

// POST route to create an order

async function generateTemporaryOrderId() {
  try {
    // Get the counter for 'order' (you can change 'order' to any unique string)
    const counter = await Counter.findOneAndUpdate(
      { name: 'order' }, // Look for 'order' counter
      { $inc: { sequence_value: 1 } },  // Increment the sequence_value by 1
      { new: true, upsert: true } // If not found, create a new document
    );

    // Generate the order ID
    return `OR${counter.sequence_value}`;
  } catch (error) {
    console.error("Error generating order ID:", error);
    throw new Error("Could not generate order ID");
  }
}

router.post('/createOrder', async (req, res) => {
  const { userId, totalAmount, customerEmail, customerPhone, status, orderLines } = req.body;
  try {
    const orderId = await generateTemporaryOrderId();
    console.log("checkOrderId", orderId)
    const orderLinePromises = orderLines.map(async (line) => {
      const orderLine = new MTSEcomOrderLine({
        ...line,
        orderId: orderId,
        status: status,
      });
      const savedOrderLine = await orderLine.save();  // Save OrderLine to DB
      return savedOrderLine._id;  // Return the saved OrderLine's ObjectId
    });

    const savedOrderLineIds = await Promise.all(orderLinePromises);  // Wait for all OrderLines to be saved

    // Step 2: Create the Order document and link saved OrderLines
    const newOrder = new MTSEcomOrder({
      userId,
      orderId,
      totalAmount,
      customerEmail,
      customerPhone,
      status,
      orderLines: savedOrderLineIds,
    });

    // Save the Order to DB
    const savedOrder = await newOrder.save();

    // Send the saved order back as a response
    res.status(200).json(savedOrder);
  } catch (err) {
    console.error('Error creating order:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

router.get('/orders/:orderId', async (req, res) => {
  try {
    const { orderId } = req.params;
    console.log('Incoming orderId:', orderId);

    const order = await MTSEcomOrder.findOne({ orderId });
    if (!order) {
      console.warn('Order not found for:', orderId);
      return res.status(404).json({ message: 'Order not found' });
    }

    // 🔥 Fetch order lines manually
    const orderLines = await MTSEcomOrderLine.find({ orderId });
    const fullOrder = { ...order.toObject(), orderLines };

    console.log('Fetched order with orderLines:', fullOrder);
    res.json(fullOrder);
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({ message: 'Server error' });
  }
});





router.post('/changeOrder', async (req, res) => {
  const { orderId, orderLine } = req.body;
  console.log('Change order  req.body', req.body);

  try {
    // 1. Save the new order line
    const newOrderLine = new MTSEcomOrderLine({
      ...orderLine,
      orderId,
      status: 'Pending',
    });
    const savedOrderLine = await newOrderLine.save();

    // 2. Add it to the existing order's orderLines array
    const updatedOrder = await MTSEcomOrder.findOneAndUpdate(
      { orderId },
      {
        $push: { orderLines: savedOrderLine._id },
        $inc: { totalAmount: orderLine.price }, // Optionally update total
        updatedAt: new Date(),
      },
      { new: true }
    );

    res.status(200).json({ message: 'Order updated', order: updatedOrder });
  } catch (err) {
    console.error('Error adding item to existing order:', err);
    res.status(500).json({ message: 'Server error', error: err });
  }
});

// PUT route to update order status

router.put('/updateOrderStatus', async (req, res) => {
  const { orderId, status } = req.body;
  try {
    const order = await MTSEcomOrder.findOne({ orderId });
    if (!order) return res.status(404).json({ error: 'Order not found' });

    // Update order status
    order.status = status;
    await order.save();

    // Update ALL related order lines
    const orderLinesResult = await MTSEcomOrderLine.updateMany(
      { orderId },
      { $set: { status } }
    );

    res.status(200).json({
      message: 'Order status updated successfully',
      updatedOrder: order,
      updatedOrderLinesCount: orderLinesResult.modifiedCount,
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



// router.put('/updateOrderStatus', async (req, res) => {
//     const { orderId, status } = req.body;
//     try {
//       // Find the order based on orderId
//       const order = await MTSEcomOrder.findOne({ orderId });

//       // Check if the order exists
//       if (!order) {
//         return res.status(404).json({ error: 'Order not found' });
//       }

//       // Update the order status
//       order.status = status;

//       // Update the status of each orderLine as well
//       order.orderLines.forEach(orderLine => {
//         orderLine.status = status; // Update status in orderLines
//       });

//       // Save the updated order
//       await order.save();

//       res.status(200).json({ message: 'Order status and order lines updated successfully' });
//     } catch (error) {
//       console.error('Error updating order status:', error);
//       res.status(500).json({ error: 'Internal server error' });
//     }
//   });


// PUT route to update order line quantity
// In your backend route
router.put('/updateOrderLineQuantity', async (req, res) => {
  const { orderId, productId, quantity } = req.body;
  if (!orderId || !productId || typeof quantity !== 'number') {
    return res.status(400).json({ error: "Missing or invalid input fields" });
  }
  try {
    // Find the order line by orderId and productId
    const updatedOrderLine = await OrderLine.findOneAndUpdate(
      { orderId, productId }, // Use both orderId and productId to find the correct order line
      { $set: { quantity } },  // Update the quantity
      { new: true } // Return the updated document
    );

    if (!updatedOrderLine) {
      return res.status(404).json({ error: "Order line not found" });
    }

    res.status(200).json({
      message: "Order line quantity updated successfully",
      updatedOrderLine,
    });
  } catch (error) {
    console.error("Error updating order line quantity:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});




export default router;
