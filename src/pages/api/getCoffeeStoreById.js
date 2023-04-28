import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

export default async function getCoffeeStoreById(req, res) {
  const { id } = req.query;

  try {
    if (id) {
      const records = await findRecordByFilter(id);

      if (records.length !== 0) {
        return res.json(records);
      } else {
        res.json({
            message: `Id could not be found: ${id}`
        })
      }
    } else {
      res.status(400).json({
        message: "Id is missing",
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json(error);
  }
}
