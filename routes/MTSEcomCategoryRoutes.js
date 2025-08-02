app.get('/api/categories', (req, res) => {
    Category.find()  // Find all categories in the database
      .then((categories) => {
        res.json(categories); // Send categories as JSON response
      })
      .catch((error) => {
        console.error('Error fetching categories:', error);
        res.status(500).json({ message: 'Error fetching categories' });
      });
  });