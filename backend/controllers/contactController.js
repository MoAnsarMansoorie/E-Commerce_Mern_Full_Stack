import contactModel from "../models/contactModel.js";

const createContact = async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !message) {
            return res.status(400).json({ success: false, message: 'Name, email and message are required' });
        }

        const contact = new contactModel({ name, email, subject, message });
        await contact.save();

        return res.status(201).json({ success: true, message: 'Message received. We will get back to you shortly.' });
    } catch (error) {
        console.error('Error in createContact:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

const listContacts = async (req, res) => {
    try {
        const contacts = await contactModel.find({}).sort({ createdAt: -1 });
        return res.status(200).json({ success: true, contacts });
    } catch (error) {
        console.error('Error in listContacts:', error);
        return res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}

export { createContact, listContacts };
