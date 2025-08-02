require('dotenv').config();

const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/MTSSagolUserRoutes');
const  connectDB  = require('./config/db');
const MTSSagolItem = require('./routes/MTSSagolItemRoutes')
const MTSSagolSupplier = require('./routes/MTSSagolSupplyRoutes')
const MtsSagolLocation = require('./routes/MTSSagolLocationRoutes');
const  MTSSagolInventory  = require('./routes/MTSSagolInventoryRoutes');
const MTSSagolUnits = require('./routes/MTSSagolUnits')
const MTSSagolOrder = require('./routes/MTSSagolOrderRoutes')
const MTSSagolCounter = require('./routes/MTSSagolPOCounterRoutes')
const MTSSagolReceive = require('./routes/MTSSagolReceiveRejectRoutes')
const MTSSagolProcessFinishGood  = require('./routes/MTSSagolProFinGoodRoutes')
const MTSSagolALert = require('./routes/MTSSagolAlertRoutes')
const app = express();
const path= require('path');



const dealsData = [
  {
    id: 1,
    name: 'best_deals',
    price: '$49.99',
    description: 'A stylish black boot',
    image: '/assets/images/best_deals.png',
  },
  {
    id: 2,
    name: 'Special_Deals',
    price: '$29.99',
    description: 'A durable blue raincoat',
    image: '/assets/images/special_deals.png',
  },
  {
    id: 3,
    name: 'Special_offers',
    price: '$39.99',
    description: 'A cute bag for everyday use',
    image: '/assets/images/special_offers.png',
  }
];

// Serve static images
app.use('/assets/images', express.static(path.join(__dirname, 'assets/images')));
app.get('/api/deals', (req, res) => {
  res.json(dealsData); 
});

// Middleware
app.use(cors());
app.use(express.json());
connectDB();
// Routes
app.use('/api/auth', authRoutes);
app.use('/api/mtsSagolItem', MTSSagolItem)
app.use('/api/mtsSagolSupply', MTSSagolSupplier)
app.use('/api/mtsSagolLocation', MtsSagolLocation)
app.use('/api/mtsSagolInventory', MTSSagolInventory)
app.use('/api', MTSSagolUnits);
app.use('/api/mtsSagolOrder', MTSSagolOrder);
app.use('/api/', MTSSagolCounter)
app.use('/api/mtsSagolReceive', MTSSagolReceive)
app.use('/api/mtsSagolProcess',MTSSagolProcessFinishGood)
app.use('/api/mtsSagolAlert',MTSSagolALert)

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
