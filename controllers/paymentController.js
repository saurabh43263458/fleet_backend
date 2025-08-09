const paymentService = require("../service/paymentService");

exports.createOrder = async (req, res) => {
  try {
    const response = await paymentService.createOrder(req.body);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const response = await paymentService.verifyAndStorePayment(req.body);
    res.json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getPaymentHistory = async (req, res) => {
  try {
    const response = await paymentService.getHistory(req.params.userId);
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
