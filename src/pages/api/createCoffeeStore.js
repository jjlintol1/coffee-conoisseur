import { table, getMinifiedRecords, findRecordByFilter } from "@/lib/airtable";

export default async function createCoffeeStore(req, res) {
  try {
    if (req.method === "POST") {
      const { id, name, address, dma, voting, imgUrl } = req.body;
      if (id) {
        const records = await findRecordByFilter(id);

        if (records.length !== 0) {
          return res.json(records);
        } else {
          if (name) {
            const createdRecords = await table.create([
              {
                fields: {
                  id,
                  name,
                  address,
                  dma,
                  voting,
                  imgUrl,
                },
              },
            ]);
            const records = getMinifiedRecords(createdRecords);
            return res.json(records);
          } else {
            res.status(400).json({
              message: "Name is missing",
            });
          }
        }
      } else {
        return res.status(400).json({
            message: "Id is missing"
        })
      }
    } else {
      return res.json({
        message: "Method is GET",
      });
    }
  } catch (error) {
    return res.status(500).json(error);
  }
}
