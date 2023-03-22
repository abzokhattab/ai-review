import fetch from "node-fetch";

export async function generateCodeReview(prompt, key) {
  const payload = {
    model: "text-davinci-003",
    prompt,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 1000,
    stream: false,
    n: 1,
  };
  const response = await fetch("https://api.openai.com/v1/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key ?? ""}`,
    },
    method: "POST",
    body: JSON.stringify(payload),
  });

  const json = await response.json();
  if (json.error) {
    console.error("OpenAI Erorr: " + json.error.message);
    process.exit(0);
  }
  return json.choices[0]?.text;
}
