import { getCoffeeStores } from "@/lib/coffee-stores";

export default async function getCoffeeStoresByLocation(req, res) {
    const { latLng, limit } = req.query;

    try {
        const response = await getCoffeeStores(latLng, limit);
        return res.status(200).json(response)
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            error
        });
    }

}