import Counter from '../model/MTSCounter.js'; 

// Function to generate an auto-incrementing order ID
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
