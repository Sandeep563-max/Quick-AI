import { clerkClient } from "@clerk/express";

export const auth = async (req, res, next) => {
    try {
        const { userId } = req.auth();

        if (!userId) {
            return res.status(401).json({ success: false, message: "Unauthorized" });
        }

        const user = await clerkClient.users.getUser(userId);

        const currentPlan = user.publicMetadata.plan || 'free';
        const hasPremiumPlan = currentPlan === 'premium';

        if (!hasPremiumPlan && user.privateMetadata.free_usage) {
            req.free_usage = user.privateMetadata.free_usage;
        } else {
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: { free_usage: 0 }
            });
            req.free_usage = 0;
        }

        req.plan = hasPremiumPlan ? 'premium' : 'free';
        next();
    } catch (error) {
        console.error("🚨 Auth Error:", error.message);
        res.status(500).json({ success: false, message: error.message });
    }
}