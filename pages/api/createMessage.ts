import type { NextApiRequest, NextApiResponse } from "next";
import db from "../../firebase/config";
import { addDoc, collection } from "firebase/firestore";

const firestoreCollection = collection(db, "messages");

const createMessage = async (req: NextApiRequest, res: NextApiResponse) => {
  try {
    await addDoc(firestoreCollection, req.body);
    res.status(200).json("OK");
  } catch (err: any) {
    console.error(err);
    res.status(500).json("Internal Server Error");
  }
};

export default createMessage;
