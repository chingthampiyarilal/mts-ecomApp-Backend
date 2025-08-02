const mtsSagolSupplierModel = require('../model/testPGModal');

const createMtsSagolSupplierPO = async (body) => {
  try {
    const result = await mtsSagolSupplierModel.createMtsSagolSupplierPO(body);
    return result;
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
};

const getMtsSagolSupplierPO = async (id) => {
  try {
    const result = id 
      ? await mtsSagolSupplierModel.getMtsSagolSupplierPOById(id) // Get by ID
      : await mtsSagolSupplierModel.getAllMtsSagolSupplierPOs(); // Get all if no ID provided
    return result;
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
};
const getAllMtsSagolSuppliers = async () => {
  try {
    const result = await mtsSagolSupplierModel.getAllMtsSagolSupplierPOs(); // Call model function to fetch all suppliers
    return result;
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
};

const updateMtsSagolSupplierPO = async (id, body) => {
  try {
    const result = await mtsSagolSupplierModel.updateMtsSagolSupplierPO(id, body);
    if (!result) {
      throw new Error('Supplier PO not found');
    }
    return result;
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
};

const deleteMtsSagolSupplierPO = async (id) => {
  try {
    const result = await mtsSagolSupplierModel.deleteMtsSagolSupplierPO(id);
    if (!result) {
      throw new Error('Supplier PO not found');
    }
    return { message: 'Supplier PO deleted successfully' };
  } catch (error) {
    throw new Error(`Service error: ${error.message}`);
  }
};

module.exports = { createMtsSagolSupplierPO, getMtsSagolSupplierPO,getAllMtsSagolSuppliers, updateMtsSagolSupplierPO, deleteMtsSagolSupplierPO };
