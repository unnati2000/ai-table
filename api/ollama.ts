import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    try {
      const response = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "codegemma", // Specify the locally installed model
          prompt: req.body.prompt, // The prompt sent from the client
        }),
      });

      const data = await response.json();

      // Return the generated text from the model
      res.status(200).json({ text: data.text });
    } catch (error) {
      res.status(500).json({ error: "Error generating response" });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

