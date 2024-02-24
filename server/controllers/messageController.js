import MessageSchema from "../model/messageModel.js";

const addMessage = async (req, res, next) => {
    try {
        const { from, to, message } = req.body;
        const data = await MessageSchema.create({
            message: { text: message },
            users: [from, to],
            sender: from
        })

        if (data) {
            return res.json({ status: true, msg: "Message added successfully" });
        }

        return res.json({ status: false, msg: "Failed to add message" });
    } catch(error) {
        console.error(error);
    }
}

const getAllMessages = async (req, res, next) => {
    try {
        const { from, to } = req.query;
        console.log(req.query);
    
        const messages = await MessageSchema.find({
          users: {
            $all: [from, to],
          },
        }).sort({ updatedAt: 1 });
    
        const projectedMessages = messages.map((msg) => {
          return {
            fromSelf: msg.sender.toString() === from,
            message: msg.message.text,
          };
        });
        
        res.json(projectedMessages);
    } catch (error) {
        console.error(error)
    }
}

export { addMessage, getAllMessages };